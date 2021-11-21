import { PutItemCommand, GetItemCommand } from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { EnvName, IGetTags, IPutTags } from '../interfaces';
import { SK_SEPARATOR } from '../../constants';
import { Repository } from '.';

export class TagsRepository extends Repository {
    public tableName;

    constructor({ region = 'us-east-2', envName = EnvName.DEV }) {
        super({ region, envName: EnvName.DEV });
        this.tableName = `${envName}-tags`;
    }

    async put({ pk, sk, tags }: IPutTags) {
        const { $metadata } = this.docClient
            .send(
                new PutItemCommand({
                    TableName: this.tableName,
                    Item: marshall({ pk, sk, tags }),
                })
            )
            .catch((e) => {
                console.log(e);
                return e;
            });
        return $metadata.httpStatusCode === 200;
    }

    async get({ gameName, sk = '' }: IGetTags) {
        const { Item } = await this.docClient
            .send(
                new GetItemCommand({
                    TableName: this.tableName,
                    Key: marshall({ pk: gameName, sk: `${sk}${SK_SEPARATOR}` }),
                })
            )
            .catch((e) => {
                console.log(e);
                return e;
            });
        return unmarshall(Item);
    }
}
