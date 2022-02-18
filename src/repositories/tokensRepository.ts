import { IClip, ICustomDateFilter, IToken } from '../interfaces';
import { preMarshallPrep, getDateNow } from '../utils/dynamoUtils';
import { logIt } from '../utils/logItUtils';
import moment from 'moment';
import { Repository } from './index';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import {
    DeleteItemCommand,
    PutItemCommand,
    QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { NODE_ENV } from '../constants';

export class TokensRepository extends Repository {
    constructor() {
        super();
        this.tableName = `${NODE_ENV}-tokens`;
    }

    async create(
        guid: string,
        token: string,
        expirationDate: string,
        source: string
    ): Promise<Boolean> {
        const preMarshalledToken = preMarshallPrep({
            pk: guid,
            token,
            expirationDate,
            source,
            createdAt: getDateNow(),
        });
        const query = {
            TableName: this.tableName,
            Item: marshall(preMarshalledToken),
        };
        console.log('createQuery>', query);
        const {
            $metadata: { httpStatusCode },
        } = await this.docClient.send(new PutItemCommand(query)).catch(logIt);
        return httpStatusCode === 200;
    }

    async get(guid: string): Promise<IToken> {
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: marshall({
                ':pk': guid,
            }),
        };
        console.log('getToken', query);
        const {
            Items: [token],
        } = await this.docClient.send(new QueryCommand(query));
        return unmarshall(token) as IToken;
    }

    async delete(guid): Promise<Boolean> {
        const query = {
            TableName: this.tableName,
            Key: marshall({ pk: guid }),
        };
        console.log('deleteQuery>', query);
        const {
            $metadata: { httpStatusCode },
        } = await this.docClient.send(new DeleteItemCommand(query));
        return httpStatusCode === 200;
    }
}
