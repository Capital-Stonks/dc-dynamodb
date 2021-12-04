"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsRepository = void 0;
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const _1 = require(".");
const constants_1 = require("../constants");
class TagsRepository extends _1.Repository {
    constructor(config = { region: 'us-east-2', envName: constants_1.DYNAMO_ENV_NAME }) {
        super(config);
        this.tableName = `${config.envName}-tags`;
    }
    async put({ pk, tags }) {
        const res = await this.docClient
            .send(new client_dynamodb_1.PutItemCommand({
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)({ pk, tags }),
        }))
            .catch((e) => {
            console.log(e);
            return e;
        });
        return res?.$metadata.httpStatusCode === 200;
    }
    async get() {
        const { Item } = await this.docClient
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
    }
}
exports.TagsRepository = TagsRepository;
//# sourceMappingURL=tagsRepository.js.map