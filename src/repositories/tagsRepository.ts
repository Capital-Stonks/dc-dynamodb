import { PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { EnvName, IGetTags, IPutTags, ITags } from '../interfaces';
import { Repository } from '.';
import { DYNAMO_ENV_NAME } from '../constants';

interface IGetResponse {
    tags: ITags;
}

export class TagsRepository extends Repository {
    constructor({ region = 'us-east-2', envName = DYNAMO_ENV_NAME }) {
        super({ region, envName: EnvName.DEV });
        this.tableName = `${envName}-tags`;
    }

    async put({ pk, tags }: IPutTags) {
        const res = await this.docClient
            .send(
                new PutItemCommand({
                    TableName: this.tableName,
                    Item: marshall({ pk, tags }),
                })
            )
            .catch((e) => {
                console.log(e);
                return e;
            });
        return res?.$metadata.httpStatusCode === 200;
    }

    async get(): Promise<IGetResponse> {
        const { Item } = await this.docClient
            .send(
                new GetItemCommand({
                    TableName: this.tableName,
                    Key: marshall({
                        pk: 'GLOBAL',
                    }),
                })
            )
            .catch((e) => {
                console.log(e);
                return e;
            });
        return unmarshall(Item) as IGetResponse;
    }
}
