"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = exports.Comparator = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const translateConfig_1 = require("../utils/translateConfig");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const constants_1 = require("../constants");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const logItUtils_1 = require("../utils/logItUtils");
const dynamoUtils_1 = require("../utils/dynamoUtils");
var Comparator;
(function (Comparator) {
    Comparator["gt"] = ">";
    Comparator["gte"] = ">=";
    Comparator["eq"] = "=";
    Comparator["lt"] = "<";
    Comparator["lte"] = "<=";
    Comparator["between"] = "BETWEEN";
})(Comparator = exports.Comparator || (exports.Comparator = {}));
class Repository {
    constructor({ region = 'us-east-2', envName = constants_1.DYNAMO_ENV_NAME, }) {
        this.Comparator = Comparator;
        this.client = new client_dynamodb_1.DynamoDB({ region });
        this.docClient = lib_dynamodb_1.DynamoDBDocumentClient.from(this.client, translateConfig_1.translateConfig);
        this.envName = envName;
    }
    async getByEquality(pk, equalityConditions, isReturnOne = false) {
        const { Items } = await this.docClient
            .send(new client_dynamodb_1.QueryCommand({
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression: 'pk = :pk',
            FilterExpression: (0, dynamoUtils_1.objectToEqualityFilterExpression)(equalityConditions),
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ':pk': pk,
                ...(0, dynamoUtils_1.objectToExpressionAttributeValues)(equalityConditions),
            }),
        }))
            .catch(logItUtils_1.logIt);
        const response = Items.map(util_dynamodb_1.unmarshall);
        return isReturnOne ? response[0] : response;
    }
}
exports.Repository = Repository;
//# sourceMappingURL=index.js.map