"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsRepository = exports.ClipsRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const interfaces_1 = require("./interfaces");
const translateConfig_1 = require("./utils/translateConfig");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const dynamoUtils_1 = require("./utils/dynamoUtils");
var Comparator;
(function (Comparator) {
    Comparator["gt"] = ">";
    Comparator["gte"] = ">=";
    Comparator["eq"] = "=";
    Comparator["lt"] = "<";
    Comparator["lte"] = "<=";
    Comparator["between"] = "BETWEEN";
})(Comparator || (Comparator = {}));
class Repository {
    constructor({ region = 'us-east-2', envName = interfaces_1.EnvName.DEV, }) {
        this.Comparator = Comparator;
        this.client = new client_dynamodb_1.DynamoDB({ region });
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(this.client, translateConfig_1.translateConfig);
        this.envName = envName;
    }
}
class ClipsRepository extends Repository {
    constructor({ region = 'us-east-2', envName = interfaces_1.EnvName.DEV }) {
        super({ region, envName: interfaces_1.EnvName.DEV });
        this.tableName = `${envName}-clips`;
    }
    create(createObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gameName, guid, username, source, sourceTitle, sourceDescription, tags, duration, resolutionHeight, rating, ratedAtDate, usedInVideoAtDate, usedInShortAtDate, aggregatedAtDate, } = createObject;
            const filteredPut = (0, dynamoUtils_1.preMarshallPrep)({
                pk: gameName,
                sk: (0, dynamoUtils_1.getSk)(gameName, guid),
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
            const { $metadata } = yield this.docClient
                .send(new client_dynamodb_1.PutItemCommand({
                TableName: this.tableName,
                Item: (0, util_dynamodb_1.marshall)(filteredPut),
            }))
                .catch((e) => {
                console.log(e);
                return e;
            });
            return $metadata.httpStatusCode === 200;
        });
    }
    put(putObject) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gameName, guid, username, source, sourceTitle, sourceDescription, tags, duration, resolutionHeight, rating, ratedAtDate, usedInVideoAtDate, usedInShortAtDate, aggregatedAtDate, } = putObject;
            const filteredPut = (0, dynamoUtils_1.preMarshallPrep)({
                pk: gameName,
                sk: (0, dynamoUtils_1.getSk)(gameName, guid),
                guid,
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
            const { $metadata } = yield this.docClient
                .send(new client_dynamodb_1.PutItemCommand({
                TableName: this.tableName,
                Item: (0, util_dynamodb_1.marshall)(filteredPut),
            }))
                .catch((e) => {
                console.log(e);
                return e;
            });
            return $metadata.httpStatusCode === 200;
        });
    }
    delete(gameName, guid) {
        return __awaiter(this, void 0, void 0, function* () {
            const { $metadata } = yield this.docClient.send(new client_dynamodb_1.DeleteItemCommand({
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)({ pk: gameName, sk: (0, dynamoUtils_1.getSk)(gameName, guid) }),
            }));
            return $metadata.httpStatusCode === 200;
        });
    }
    get(gameName, guid) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Item } = yield this.docClient
                .send(new client_dynamodb_1.GetItemCommand({
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)({ pk: gameName, sk: (0, dynamoUtils_1.getSk)(gameName, guid) }),
            }))
                .catch((e) => {
                console.log(e);
                return e;
            });
            if (!Item) {
                console.log('No records returned for', (0, dynamoUtils_1.getSk)(gameName, guid));
                return null;
            }
            return (0, util_dynamodb_1.unmarshall)(Item);
        });
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
    getByCustomDate(gameName, filter, comparator, //todo this and filter can be combined in an obj, and rating can have its own comparator too
    minimumRating = 7, includeUsedInVideo = false, includeUsedInShort = false) {
        return __awaiter(this, void 0, void 0, function* () {
            const { FilterExpression, ExpressionAttributeNames, ExpressionAttributeValues, KeyConditionExpression, } = (0, dynamoUtils_1.DateExpressionMapper)(gameName, filter, comparator, minimumRating, includeUsedInVideo, includeUsedInShort);
            const { Items } = this.docClient
                .send(new client_dynamodb_1.QueryCommand({
                TableName: this.tableName,
                ScanIndexForward: true,
                KeyConditionExpression,
                FilterExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
            }))
                .catch((e) => {
                console.log(e);
                return e;
            });
            return (0, util_dynamodb_1.unmarshall)(Items);
        });
    }
}
exports.ClipsRepository = ClipsRepository;
ClipsRepository.gsi = 'ratedAtDate-index';
class TagsRepository extends Repository {
    constructor({ region = 'us-east-2', envName = interfaces_1.EnvName.DEV }) {
        super({ region, envName: interfaces_1.EnvName.DEV });
        this.tableName = `${envName}-tags`;
    }
    put({ pk, tags }) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.docClient
                .send(new client_dynamodb_1.PutItemCommand({
                TableName: this.tableName,
                Item: (0, util_dynamodb_1.marshall)({ pk, tags }),
            }))
                .catch((e) => {
                console.log(e);
                return e;
            });
            return (res === null || res === void 0 ? void 0 : res.$metadata.httpStatusCode) === 200;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const { Item } = yield this.docClient
                .send(new client_dynamodb_1.GetItemCommand({
                TableName: this.tableName,
                Key: (0, util_dynamodb_1.marshall)({
                    pk: 'GLOBAL',
                }),
            }))
                .catch((e) => {
                console.log(e);
                return e;
            });
            return (0, util_dynamodb_1.unmarshall)(Item);
        });
    }
}
exports.TagsRepository = TagsRepository;
// {
//     TableName: this.tableName,
//         ScanIndexForward: true,
//     KeyConditionExpression: '#pk = :pk',
//     FilterExpression,
//     ExpressionAttributeNames: {
//     '#pk': 'pk',
//         [ratedAtDateMap.Key]: ratedAtDateMap.Name,
//         [usedInVideoAtDateMap.Key]: usedInVideoAtDateMap.Name,
//         [aggregatedAtDateMap.Key]: aggregatedAtDateMap.Name,
//         [aggregatedAtDateMap.Key]: usedInShortAtDateMap.Name,
// },
//     ExpressionAttributeValues: marshall({
//         ':pk': gameName,
//         [ratedAtDateMap.Value]: ratedAtDate,
//         // [usedInShortAtDateMap.Value]: usedInVideoAtDate,
//         // [aggregatedAtDateMap.Value]: aggregatedAtDate,
//         // [usedInShortAtDateMap.Value]: usedInShortAtDate,
//     }),
// }
//# sourceMappingURL=index.js.map