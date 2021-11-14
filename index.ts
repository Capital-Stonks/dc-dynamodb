import {
    DynamoDB,
    PutItemCommand,
    GetItemCommand,
    DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';
import {IDynamoConfig, IGetClips, IPutClip} from "./interfaces";
import {translateConfig} from "./utils/translateConfig";

import {ENVIRONMENT_NAME, AWS_REGION, VALORANT, SK_SEPARATOR} from './constants' ;
import {DynamoDBDocumentClient} from '@aws-sdk/lib-dynamodb';

const client = new DynamoDB({region: AWS_REGION});

class DynamoDb {
    private readonly db;
    private readonly envName;

    constructor({region, endpoint, envName}: IDynamoConfig) {
        const client = new DynamoDB({region, endpoint});
        this.db = DynamoDBDocumentClient.from(client, translateConfig);
    }

    async putGameTag(
        {
            gameName,
            guid,
            aggregatedAtDate,
            username,
            source,
            rating,
            tags,
            duration = -1,
            resolutionHeight = -1,
        }: IPutClip) {
        const put = await this.db.send(new PutItemCommand({
            TableName: `clips-${this.envName}`,
            Item: {
                pk: {S: gameName},
                sk: {S: `${gameName}${SK_SEPARATOR}9${SK_SEPARATOR}${guid}`},
                aggregatedAtDate: {S: 'unique'},
                username: {S: 'Kyle Is A Boomer'},
                source: {S: 'twitter'},
                rating: {N: '9'},
                tags: {SS: ['yoked', 'autistic', 'boomer']},
                s3key: {S: guid},
                duration: {N: duration},
                resolutionHeight: {N: resolutionHeight},
                createdAt: {S: new Date().toString()},
                updatedAt: {S: new Date().toString()},
            },
        }));
        return ''
    }

    async getClips({gameName, rating, guid}: IGetClips) {
        const get = await db.send(new GetItemCommand({
            TableName: `clips-${this.envName}`,
            Key: {
                pk: {S: VALORANT},
                sk: {S: `${VALORANT}${SK_SEPARATOR}9${SK_SEPARATOR}v4Guid1324111`},
            },
        }));
        console.log(unmarshall(getResult.Item));
    }

}

const db = DynamoDBDocumentClient.from(client, translateConfig);

(async () => {
    try {
        const table = await db.send(new DescribeTableCommand({TableName: `clips-${ENVIRONMENT_NAME}`}));
        console.log(table);
        const results = await db.send(new PutItemCommand({
            TableName: `clips-${ENVIRONMENT_NAME}`,
            Item: {
                pk: {S: VALORANT},
                sk: {S: `${VALORANT}${SK_SEPARATOR}9${SK_SEPARATOR}v4Guid1324111`},
                aggregatedAtDate: {S: 'unique'},
                username: {S: 'Kyle Is A Boomer'},
                source: {S: 'twitter'},
                rating: {N: '9'},
                tags: {SS: ['yoked', 'autistic', 'boomer']},
                s3key: {S: 'v4Guid1324'},
                createdAt: {S: new Date().toString()},
                updatedAt: {S: new Date().toString()},
            },
        }));
        const getResult = await db.send(new GetItemCommand({
            TableName: `clips-${ENVIRONMENT_NAME}`,
            Key: {
                pk: {S: VALORANT},
                sk: {S: `${VALORANT}${SK_SEPARATOR}9${SK_SEPARATOR}v4Guid1324111`},
            },
        }));
        console.log(unmarshall(getResult.Item));
    } catch (e) {
        console.log(e);
    }
})();
