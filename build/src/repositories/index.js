"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Repository = exports.Comparator = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const translateConfig_1 = require("../utils/translateConfig");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const constants_1 = require("../constants");
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
}
exports.Repository = Repository;
//# sourceMappingURL=index.js.map