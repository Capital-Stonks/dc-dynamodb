import { IClip, ICustomDateFilter, IToken } from '../interfaces';
import { preMarshallClip } from '../utils/clipEntityUtils';
import {
    DateExpressionMapper,
    getSk,
    preMarshallPrep,
} from '../utils/dynamoUtils';
import { logIt } from '../utils/logItUtils';
import moment from 'moment';
import { Repository } from './index';
import { marshall } from '@aws-sdk/util-dynamodb';
import { PutItemCommand } from '@aws-sdk/client-dynamodb';
import { NODE_ENV } from '../constants';

export class TokensRepository extends Repository {
    constructor() {
        super();
        // this.tableName = `${NODE_ENV}-tokens`;
        this.tableName = `development-tokens`;
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
        });
        const query = {
            TableName: this.tableName,
            Item: marshall(preMarshalledToken),
        };
        console.log('createQuery>', query);
        const { $metadata } = await this.docClient
            .send(new PutItemCommand(query))
            .catch(logIt);
        return $metadata.httpStatusCode === 200;
    }
}
