"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClipsRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const _1 = require(".");
const constants_1 = require("../constants");
const clipEntityUtils_1 = require("../utils/clipEntityUtils");
const dynamoUtils_1 = require("../utils/dynamoUtils");
const logItUtils_1 = require("../utils/logItUtils");
const moment_1 = __importDefault(require("moment"));
class ClipsRepository extends _1.Repository {
    constructor() {
        super();
        this.tableName = `${constants_1.NODE_ENV}-clips`;
    }
    async create(createObject) {
        const preMarshalledClip = (0, clipEntityUtils_1.preMarshallClip)(createObject, {
            isAddCreatedAt: true,
        });
        const query = {
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)(preMarshalledClip),
        };
        console.log('createQuery>', query);
        const { $metadata } = await this.docClient
            .send(new client_dynamodb_1.PutItemCommand(query))
            .catch(logItUtils_1.logIt);
        return $metadata.httpStatusCode === 200;
    }
    async put(putObject) {
        const preMarshalledClip = (0, clipEntityUtils_1.preMarshallClip)(putObject, {
            isAddUpdatedAt: true,
        });
        const query = {
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)(preMarshalledClip),
        };
        console.log('putQuery>', query);
        const { $metadata } = await this.docClient
            .send(new client_dynamodb_1.PutItemCommand(query))
            .catch(logItUtils_1.logIt);
        return $metadata.httpStatusCode === 200;
    }
    async delete(gameName, guid) {
        const query = {
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ pk: gameName, sk: (0, dynamoUtils_1.getSk)(gameName, guid) }),
        };
        console.log('deleteQuery>', query);
        const { $metadata } = await this.docClient.send(new client_dynamodb_1.DeleteItemCommand(query));
        return $metadata.httpStatusCode === 200;
    }
    async get(gameName, guid) {
        const query = {
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ pk: gameName, sk: (0, dynamoUtils_1.getSk)(gameName, guid) }),
        };
        console.log('getQuery>', query);
        const { Item } = await this.docClient
            .send(new client_dynamodb_1.GetItemCommand(query))
            .catch(logItUtils_1.logIt);
        if (!Item) {
            console.log('No records returned for', (0, dynamoUtils_1.getSk)(gameName, guid));
            return null;
        }
        return (0, util_dynamodb_1.unmarshall)(Item);
    }
    /**
     * much deeper abstraction here however I think it will be much easier to implement in the
     * other repos and it is robust enough to cover all of the short term needs i foresaw.
     *
     * @param gameName
     * @param filter YOU CAN ONLY CHOSE 1 HERE
     * @param comparator
     * @param minimumRating
     * @param includeUsedInVideo
     * @param includeUsedInShort
     */
    async getByCustomDate(gameName, filter, comparator, //todo this and filter can be combined in an obj, and rating can have its own comparator too
    minimumRating = 7, includeUsedInVideo = false, includeUsedInShort = false) {
        const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues, KeyConditionExpression, } = (0, dynamoUtils_1.DateExpressionMapper)(gameName, filter, comparator, minimumRating, includeUsedInVideo, includeUsedInShort);
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression,
            FilterExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            Limit: constants_1.DEFAULT_LIMIT,
        };
        console.log('getByCustomDateQuery>', query);
        const { Items } = await this.docClient
            .send(new client_dynamodb_1.QueryCommand(query))
            .catch(logItUtils_1.logIt);
        return (0, util_dynamodb_1.unmarshall)(Items);
    }
    async getByFolder(folder, gameName) {
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            Limit: constants_1.DEFAULT_LIMIT,
            KeyConditionExpression: 'pk = :pk',
            FilterExpression: `begins_with(s3Path, :folder)`,
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ':pk': gameName,
                ':folder': folder,
            }),
        };
        console.log('getByFolderQuery>', query);
        const { Items } = await this.docClient
            .send(new client_dynamodb_1.QueryCommand(query))
            .catch(logItUtils_1.logIt);
        return Items.map(util_dynamodb_1.unmarshall);
    }
    async getUsedInShort(gameName) {
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            Limit: constants_1.DEFAULT_LIMIT,
            KeyConditionExpression: 'pk = :pk',
            FilterExpression: `attribute_exists(usedInShortAtDate)`,
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ':pk': gameName,
            }),
        };
        console.log('getUsedInShortQuery>', query);
        const { Items } = await this.docClient.send(new client_dynamodb_1.QueryCommand(query));
        return Items.map(util_dynamodb_1.unmarshall);
    }
    async getPreProcessShortsByDate(gameName, date = (0, moment_1.default)()
        .tz('America/New_York')
        .subtract(1, 'week')
        .format('YYYY-MM-DD HH:mm:ss.SSS')) {
        const query = {
            TableName: this.tableName,
            IndexName: ClipsRepository.gsi,
            ScanIndexForward: true,
            KeyConditionExpression: 'pk = :pk and ratedAt >= :ratedAtDate',
            FilterExpression: 'contains(tags, :tags)',
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ':pk': gameName,
                ':tags': 'short',
                ':ratedAtDate': date,
            }),
        };
        console.log('getPreProcessShortsByDate>', query);
        const { Items } = await this.docClient.send(new client_dynamodb_1.QueryCommand(query));
        return Items.map(util_dynamodb_1.unmarshall);
    }
    async getByS3Path(gameName, s3Path) {
        return this.getByEquality(gameName, { s3Path }, true);
    }
}
exports.ClipsRepository = ClipsRepository;
ClipsRepository.gsi = 'pk-ratedAtDate-index';
//# sourceMappingURL=clipsRepository.js.map