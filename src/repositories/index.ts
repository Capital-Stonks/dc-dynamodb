import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { IDynamoConfig } from '../interfaces';
import { translateConfig } from '../utils/translateConfig';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DYNAMO_ENV_NAME } from '../constants';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { logIt } from '../utils/logItUtils';
import {
    objectToEqualityFilterExpression,
    objectToExpressionAttributeValues,
} from '../utils/dynamoUtils';

export enum Comparator {
    gt = '>',
    gte = '>=',
    eq = '=',
    lt = '<',
    lte = '<=',
    between = 'BETWEEN',
}
export class Repository {
    public docClient;
    public client;
    protected envName;
    public tableName;
    public Comparator = Comparator;

    constructor({
        region = 'us-east-2',
        envName = DYNAMO_ENV_NAME,
    }: IDynamoConfig) {
        this.client = new DynamoDB({ region });
        this.docClient = DynamoDBDocumentClient.from(
            this.client,
            translateConfig
        );
        this.envName = envName;
    }

    async getByEquality(
        pk: string,
        equalityConditions: object,
        isReturnOne: boolean = false
    ) {
        const { Items } = await this.docClient
            .send(
                new QueryCommand({
                    TableName: this.tableName,
                    ScanIndexForward: true,
                    KeyConditionExpression: 'pk = :pk',
                    FilterExpression:
                        objectToEqualityFilterExpression(equalityConditions),
                    ExpressionAttributeValues: marshall({
                        ':pk': pk,
                        ...objectToExpressionAttributeValues(
                            equalityConditions
                        ),
                    }),
                })
            )
            .catch(logIt);

        const response = Items.map(unmarshall);
        return isReturnOne ? response[0] : response;
    }
}
