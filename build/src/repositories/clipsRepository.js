"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClipsRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const _1 = require(".");
const constants_1 = require("../constants");
const dynamoUtils_1 = require("../utils/dynamoUtils");
const logItUtils_1 = require("../utils/logItUtils");
class ClipsRepository extends _1.Repository {
    constructor(config = { region: 'us-east-2', envName: constants_1.DYNAMO_ENV_NAME }) {
        super(config);
        this.tableName = `${config.envName}-clips`;
    }
    async create(createObject) {
        const { gameName, s3Path, guid, username, source, sourceTitle, sourceDescription, tags, duration, resolutionHeight, rating, ratedAtDate, usedInVideoAtDate, usedInShortAtDate, aggregatedAtDate, } = createObject;
        const filteredPut = (0, dynamoUtils_1.preMarshallPrep)({
            pk: gameName,
            sk: (0, dynamoUtils_1.getSk)(gameName, guid),
            s3Path,
            guid,
            aggregatedAtDate,
            username,
            source,
            sourceTitle,
            sourceDescription,
            tags,
            duration,
            resolutionHeight,
            rating,
            ratedAtDate,
            usedInVideoAtDate,
            usedInShortAtDate,
            createdAt: (0, dynamoUtils_1.dateEst)(),
        });
        const { $metadata } = await this.docClient
            .send(new client_dynamodb_1.PutItemCommand({
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)(filteredPut),
        }))
            .catch(logItUtils_1.logIt);
        return $metadata.httpStatusCode === 200;
    }
    async put(putObject) {
        const { gameName, guid, username, s3Path, source, sourceTitle, sourceDescription, tags, duration, resolutionHeight, rating, ratedAtDate, usedInVideoAtDate, usedInShortAtDate, aggregatedAtDate, } = putObject;
        const filteredPut = (0, dynamoUtils_1.preMarshallPrep)({
            pk: gameName,
            sk: (0, dynamoUtils_1.getSk)(gameName, guid),
            guid,
            s3Path,
            username,
            source,
            sourceTitle,
            sourceDescription,
            rating,
            tags,
            duration,
            resolutionHeight,
            aggregatedAtDate,
            ratedAtDate,
            usedInVideoAtDate,
            usedInShortAtDate,
            updatedAt: (0, dynamoUtils_1.dateEst)(),
        });
        const { $metadata } = await this.docClient
            .send(new client_dynamodb_1.PutItemCommand({
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)(filteredPut),
        }))
            .catch(logItUtils_1.logIt);
        return $metadata.httpStatusCode === 200;
    }
    async delete(gameName, guid) {
        const { $metadata } = await this.docClient.send(new client_dynamodb_1.DeleteItemCommand({
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ pk: gameName, sk: (0, dynamoUtils_1.getSk)(gameName, guid) }),
        }));
        return $metadata.httpStatusCode === 200;
    }
    async get(gameName, guid) {
        const { Item } = await this.docClient
            .send(new client_dynamodb_1.GetItemCommand({
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ pk: gameName, sk: (0, dynamoUtils_1.getSk)(gameName, guid) }),
        }))
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
        const { Items } = await this.docClient
            .send(new client_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression,
            FilterExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
        }))
            .catch(logItUtils_1.logIt);
        return (0, util_dynamodb_1.unmarshall)(Items);
    }
    async getByFolder(folder, gameName) {
        const { Items } = await this.docClient
            .send(new client_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression: 'pk = :pk',
            FilterExpression: `contains(s3Path, :folder)`,
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ':pk': gameName,
                ':folder': folder,
            }),
        }))
            .catch(logItUtils_1.logIt);
        return Items.map(util_dynamodb_1.unmarshall);
    }
    async getUsedInShort(gameName) {
        const { Items } = await this.docClient.send(new client_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression: 'pk = :pk',
            FilterExpression: `attribute_exists(usedInShortAtDate)`,
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ':pk': gameName,
            }),
        }));
        return Items.map(util_dynamodb_1.unmarshall);
    }
    async getByS3Path(gameName, s3Path) {
        return this.getByEquality(gameName, { s3Path }, true);
    }
}
exports.ClipsRepository = ClipsRepository;
ClipsRepository.gsi = 'ratedAtDate-index';
//# sourceMappingURL=clipsRepository.js.map