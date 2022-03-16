"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensRepository = void 0;
const dynamoUtils_1 = require("../utils/dynamoUtils");
const logItUtils_1 = require("../utils/logItUtils");
const index_1 = require("./index");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const constants_1 = require("../constants");
class TokensRepository extends index_1.Repository {
    constructor() {
        super();
        this.tableName = `${constants_1.NODE_ENV}-tokens`;
    }
    /**
     *
     * @param csrfState PK and guid - gets compared for security
     * @param accessToken Token for interacting with upload api
     * @param refreshToken Token used to refresh the access token
     * @param expirationDate
     * @param source Enum UPLOAD_PLATFORMS
     */
    async put({ csrfState, accessToken, refreshToken, expirationDate, source, }) {
        const preMarshalledToken = (0, dynamoUtils_1.preMarshallPrep)({
            csrfState,
            accessToken,
            refreshToken,
            expirationDate,
            source,
            createdAt: (0, dynamoUtils_1.getDateNow)(),
        });
        const query = {
            TableName: this.tableName,
            Item: (0, util_dynamodb_1.marshall)(preMarshalledToken),
        };
        console.log('createQuery>', query);
        const { $metadata: { httpStatusCode }, } = await this.docClient.send(new client_dynamodb_1.PutItemCommand(query)).catch(logItUtils_1.logIt);
        return httpStatusCode === 200;
    }
    async get(state) {
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression: 'csrfState = :csrfState',
            ExpressionAttributeValues: (0, util_dynamodb_1.marshall)({
                ':csrfState': state,
            }),
        };
        console.log('getToken', query);
        const { Items: [token], } = await this.docClient.send(new client_dynamodb_1.QueryCommand(query));
        return (0, util_dynamodb_1.unmarshall)(token);
    }
    async delete(guid) {
        const query = {
            TableName: this.tableName,
            Key: (0, util_dynamodb_1.marshall)({ csrfState: guid }),
        };
        console.log('deleteQuery>', query);
        const { $metadata: { httpStatusCode }, } = await this.docClient.send(new client_dynamodb_1.DeleteItemCommand(query));
        return httpStatusCode === 200;
    }
}
exports.TokensRepository = TokensRepository;
//# sourceMappingURL=tokensRepository.js.map