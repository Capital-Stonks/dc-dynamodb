import { DynamoDB } from '@aws-sdk/client-dynamodb';
import { EnvName, IDynamoConfig } from '../interfaces';
import { translateConfig } from '../utils/translateConfig';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

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
    public Expression = Comparator;

    constructor({
        region = 'us-east-2',
        envName = EnvName.DEV,
    }: IDynamoConfig) {
        this.client = new DynamoDB({ region });
        this.docClient = DynamoDBDocumentClient.from(
            this.client,
            translateConfig
        );
        this.envName = envName;
    }
}
