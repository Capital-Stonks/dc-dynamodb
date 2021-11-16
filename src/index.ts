import {
    DynamoDB,
    PutItemCommand,
    GetItemCommand,
    DescribeTableCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { EnvName, IDynamoConfig, IGetClips, IPutClip } from './interfaces';
import { translateConfig } from './utils/translateConfig';

import { VALORANT, SK_SEPARATOR } from '../constants.js' ;
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { preMarshallPrep } from './utils/dynamoUtils';

class Repository {
    public docClient;
    public client;
    protected envName;

    constructor({ region, envName = EnvName.DEV }: IDynamoConfig) {
        this.client = new DynamoDB({ region });
        this.docClient = DynamoDBDocumentClient.from(this.client, translateConfig);
        this.envName = envName;
    }
}

export class ClipsRepository extends Repository {
    async putClip(putObject: IPutClip) {
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
            aggregatedAtDate,
        } = putObject;
        const filteredPut = preMarshallPrep({
            pk: gameName,
            sk: `${gameName}${SK_SEPARATOR}${guid}`,
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
            createdAt: new Date().toString(),
            updatedAt: new Date().toString(),
        });
        const put = await this.docClient.send(new PutItemCommand({
            TableName: `${this.envName}-clips`,
            Item: marshall(filteredPut),
        })).catch((e) => {
            console.log(e);
            return e;
        });
        return put;
    }

    // async getClips({ gameName, rating, guid }: IGetClips) {
    //     const get = await this.docClient.send(new GetItemCommand({
    //         TableName: `clips-${this.envName}`,
    //         Key: {
    //             pk: { S: VALORANT },
    //             sk: { S: `${VALORANT}${SK_SEPARATOR}9${SK_SEPARATOR}v4Guid1324111` },
    //         },
    //     }));
    //     // console.log(unmarshall(getResult.Item));
    // }
}

export class TagsRepository extends Repository {
    async putTags(pk, sk) { // todo finish
        const put = await this.docClient.send(new PutItemCommand({
            TableName: `${this.envName}-clips`,
            Item: marshall({ pk, sk }),
        }));
    };
};

//
//
// (async () => {
//     try {
//         const table = await db.send(new DescribeTableCommand({TableName: `clips-${ENVIRONMENT_NAME}`}));
//         console.log(table);
//         const results = await db.send(new PutItemCommand({
//             TableName: `clips-${ENVIRONMENT_NAME}`,
//             Item: {
//                 pk: {S: VALORANT},
//                 sk: {S: `${VALORANT}${SK_SEPARATOR}9${SK_SEPARATOR}v4Guid1324111`},
//                 aggregatedAtDate: {S: 'unique'},
//                 username: {S: 'Kyle Is A Boomer'},
//                 source: {S: 'twitter'},
//                 rating: {N: '9'},
//                 tags: {SS: ['yoked', 'autistic', 'boomer']},
//                 s3key: {S: 'v4Guid1324'},
//                 createdAt: {S: new Date().toString()},
//                 updatedAt: {S: new Date().toString()},
//             },
//         }));
//         const getResult = await db.send(new GetItemCommand({
//             TableName: `clips-${ENVIRONMENT_NAME}`,
//             Key: {
//                 pk: {S: VALORANT},
//                 sk: {S: `${VALORANT}${SK_SEPARATOR}9${SK_SEPARATOR}v4Guid1324111`},
//             },
//         }));
//         // console.log(unmarshall(getResult.Item));
//     } catch (e) {
//         console.log(e);
//     }
// })();
