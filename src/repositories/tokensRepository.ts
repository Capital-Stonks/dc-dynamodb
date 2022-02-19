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

    async put({
        state,
        accessToken,
        refreshToken,
        expirationDate,
        source,
    }: {
        state: string;
        accessToken: string;
        refreshToken: string;
        expirationDate: string;
        source: string;
    }): Promise<Boolean> {
        const preMarshalledToken = preMarshallPrep({
            pk: state,
            accessToken,
            refreshToken,
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

    async get(state: string): Promise<IToken> {
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: marshall({
                ':pk': state,
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
