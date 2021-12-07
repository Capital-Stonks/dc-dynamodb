import { DynamoDB, QueryCommand } from '@aws-sdk/client-dynamodb';
import { IDynamoConfig } from '../interfaces';
import { translateConfig } from '../utils/translateConfig';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DEFAULT_LIMIT, DYNAMO_CONFIG } from '../constants';
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

    constructor() {
        this.client = new DynamoDB(DYNAMO_CONFIG);
        this.docClient = DynamoDBDocumentClient.from(
            this.client,
            translateConfig
        );
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
                    Limit: DEFAULT_LIMIT,
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
