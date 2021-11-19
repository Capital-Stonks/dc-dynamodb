import {
    DynamoDB,
    PutItemCommand,
    GetItemCommand,
    DeleteItemCommand, QueryCommand, QueryCommandInput,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { EnvName, ICustomDateFilter, IDynamoConfig, IGetClip, IPutClip } from './interfaces';
import { translateConfig } from './utils/translateConfig';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import {
    columnNameKeyValueMaps,
    dateEst,
    ExpressionMapper,
    getFilterExpression,
    getSk,
    preMarshallPrep,
} from './utils/dynamoUtils';

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
        filter: ICustomDateFilter,
        expression: Expression,
        usedInVideo = false,
        usedInShort = false,
    ) {

        const {
            FilterExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
        } = ExpressionMapper(gameName, filter, expression, usedInVideo, usedInShort);


        const res = await this.docClient.send(
            new QueryCommand({
                TableName: this.tableName,
                ScanIndexForward: true,
                KeyConditionExpression: '#pk = :pk',
                FilterExpression,
                ExpressionAttributeNames,
                ExpressionAttributeValues,
            }),
        ).catch((e) => {
            console.log(e);
            return e;
        });
        if (res.Items?.length) {
            console.log('No records returned for');
            return null;
        }
        // return unmarshall(Items);
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

//
//
// {
//     TableName: this.tableName,
//         ScanIndexForward: true,
//     KeyConditionExpression: '#pk = :pk',
//     FilterExpression,
//     ExpressionAttributeNames: {
//     '#pk': 'pk',
//         [ratedAtDateMap.Key]: ratedAtDateMap.Name,
//         [usedInVideoAtDateMap.Key]: usedInVideoAtDateMap.Name,
//         [aggregatedAtDateMap.Key]: aggregatedAtDateMap.Name,
//         [aggregatedAtDateMap.Key]: usedInShortAtDateMap.Name,
// },
//     ExpressionAttributeValues: marshall({
//         ':pk': gameName,
//         [ratedAtDateMap.Value]: ratedAtDate,
//         // [usedInShortAtDateMap.Value]: usedInVideoAtDate,
//         // [aggregatedAtDateMap.Value]: aggregatedAtDate,
//         // [usedInShortAtDateMap.Value]: usedInShortAtDate,
//     }),
// }
