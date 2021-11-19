import {
    DynamoDB,
    PutItemCommand,
    GetItemCommand,
    DeleteItemCommand, QueryCommand, QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { EnvName, ICustomDateQuery, IDynamoConfig, IGetClip, IPutClip } from './interfaces';
import { translateConfig } from './utils/translateConfig';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { dateEst, getSk, preMarshallPrep } from './utils/dynamoUtils';

enum Expression {
    gt = '>',
    gte = '>=',
    eq = '=',
    lt = '<',
    lte = '<=',
    between = 'BETWEEN'
}

class Repository {
    public docClient;
    public client;
    protected envName;
    public Expression = Expression;

    constructor({ region = 'us-east-2', envName = EnvName.DEV }: IDynamoConfig) {
        this.client = new DynamoDB({ region });
        this.docClient = DynamoDBDocumentClient.from(this.client, translateConfig);
        this.envName = envName;
    }
}

export class ClipsRepository extends Repository {
    public tableName;

    constructor({ region = 'us-east-2', envName = EnvName.DEV }) {
        super({ region, envName: EnvName.DEV });
        this.tableName = `${envName}-clips`;
    }

    async create(createObject: IPutClip) {
        const {
            gameName,
            guid,
            username,
            source,
            sourceTitle,
            sourceDescription,
            tags,
            duration,
            resolutionHeight,
            rating,
            ratedAtDate,
            usedInVideoAtDate,
            usedInShortAtDate,
            aggregatedAtDate,
        } = createObject;
        const filteredPut = preMarshallPrep({
            pk: gameName,
            sk: getSk(gameName, guid),
            guid,
            aggregatedAtDate,
            username,
            source,
            sourceTitle,
            sourceDescription,
            rating,
            tags,
            duration,
            resolutionHeight,
            ratedAtDate,
            usedInVideoAtDate,
            usedInShortAtDate,
            createdAt: dateEst(),
        });

        return this.docClient.send(new PutItemCommand({
            TableName: this.tableName,
            Item: marshall(filteredPut),
        })).catch((e) => {
            console.log(e);
            return e;
        });
    }

    async put(putObject: IPutClip) {
        const {
            gameName,
            guid,
            username,
            source,
            sourceTitle,
            sourceDescription,
            tags,
            duration,
            resolutionHeight,
            rating,
            ratedAtDate,
            usedInVideoAtDate,
            usedInShortAtDate,
            aggregatedAtDate,
        } = putObject;
        const filteredPut = preMarshallPrep({
            pk: gameName,
            sk: getSk(gameName, guid),
            guid,
            username,
            source,
            sourceTitle,
            sourceDescription,
            rating,
            tags,
            duration,
            resolutionHeight,
            aggregatedAtDate,
            ratedAtDate,
            usedInVideoAtDate,
            usedInShortAtDate,
            updatedAt: dateEst(),
        });

        return this.docClient.send(new PutItemCommand({
            TableName: this.tableName,
            Item: marshall(filteredPut),
        })).catch((e) => {
            console.log(e);
            return e;
        });
    }

    async delete(gameName, guid) {
        return this.docClient.send(new DeleteItemCommand({
            TableName: this.tableName,
            Key: marshall({ pk: gameName, sk: getSk(gameName, guid) }),
        }));
    }


    async get(gameName, guid) {
        const { Item } = await this.docClient.send(new GetItemCommand({
            TableName: this.tableName,
            Key: marshall({ pk: gameName, sk: getSk(gameName, guid) }),
        })).catch((e) => {
            console.log(e);
            return e;
        });
        if (!Item) {
            console.log('No records returned for', getSk(gameName, guid));
            return null;
        }
        return unmarshall(Item);
    }

    async getByCustomDate(
        gameName: string,
        {
            ratedAtDate,
            usedInVideoAtDate,
            aggregatedAtDate,
        }: ICustomDateQuery,
        expression: Expression,
        usedInVideo = false,
        usedInShort = false,
    ) {
        const dateQueryExpressions = {
            FilterExpression: '#ratedAtDate >= :ratedAtDate',
            ExpressionAttributeNames: {
                '#ratedAtDate': ratedAtDate,/* ? 'ratedAtDate' : undefined,*/
                // '#usedInVideoAtDate' : usedInVideoAtDate ? 'usedInVideoAtDate' : undefined,
                // '#aggregatedAtDate' : aggregatedAtDate ? 'aggregatedAtDate' : undefined,
            },
            ExpressionAttributeValues: {
                ':ratedAtDate': ratedAtDate,
                // ':usedInVideoAtDate': usedInVideoAtDate,
                // ':aggregatedAtDate': aggregatedAtDate,
            },
        };
        const { Item } = await this.docClient.send(new QueryCommand({
                TableName: this.tableName,
                ScanIndexForward: true,
                FilterExpression: '#ratedAtDate >= :ratedAtDate',
                ExpressionAttributeNames: {
                    '#ratedAtDate': ratedAtDate ? 'ratedAtDate' : undefined,
                    '#usedInVideoAtDate' : usedInVideoAtDate ? 'usedInVideoAtDate' : undefined,
                    '#aggregatedAtDate' : aggregatedAtDate ? 'aggregatedAtDate' : undefined,
                },
                ExpressionAttributeValues: {
                    ':ratedAtDate': ratedAtDate,
                    ':usedInVideoAtDate': usedInVideoAtDate,
                    ':aggregatedAtDate': aggregatedAtDate,
                },
            } as unknown as QueryCommandInput,
        )).catch((e) => {
            console.log(e);
            return e;
        });
        if (!Item) {
            console.log('No records returned for');
            return null;
        }
        return unmarshall(Item);
    }
}

export class TagsRepository extends Repository {
    async putTags(pk, sk) { // todo finish
        const put = await this.docClient.send(new PutItemCommand({
            TableName: `${this.envName}-clips`,
            Item: marshall({ pk, sk }),
        }));
    };
}
