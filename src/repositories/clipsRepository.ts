import {
    PutItemCommand,
    GetItemCommand,
    DeleteItemCommand,
    QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Repository, Comparator } from '.';
import { DYNAMO_ENV_NAME } from '../constants';
import { IClip, ICustomDateFilter } from '../interfaces';
import { preMarshallClip } from '../utils/clipEntityUtils';
import { DateExpressionMapper, getSk } from '../utils/dynamoUtils';
import { logIt } from '../utils/logItUtils';

export class ClipsRepository extends Repository {
    public static gsi = 'ratedAtDate-index';

    constructor(config = { region: 'us-east-2', envName: DYNAMO_ENV_NAME }) {
        super(config);
        this.tableName = `${config.envName}-clips`;
    }

    async create(createObject: IClip): Promise<Boolean> {
        const preMarshalledClip = preMarshallClip(createObject, {
            isAddCreatedAt: true,
        });
        const query = {
            TableName: this.tableName,
            Item: marshall(preMarshalledClip),
        };
        console.log('createQuery>', query);
        const { $metadata } = await this.docClient
            .send(new PutItemCommand(query))
            .catch(logIt);
        return $metadata.httpStatusCode === 200;
    }

    async put(putObject: IClip): Promise<Boolean> {
        const preMarshalledClip = preMarshallClip(putObject, {
            isAddUpdatedAt: true,
        });
        const query = {
            TableName: this.tableName,
            Item: marshall(preMarshalledClip),
        };
        console.log('putQuery>', query);
        const { $metadata } = await this.docClient
            .send(new PutItemCommand(query))
            .catch(logIt);
        return $metadata.httpStatusCode === 200;
    }

    async delete(gameName, guid): Promise<Boolean> {
        const query = {
            TableName: this.tableName,
            Key: marshall({ pk: gameName, sk: getSk(gameName, guid) }),
        };
        console.log('deleteQuery>', query);
        const { $metadata } = await this.docClient.send(
            new DeleteItemCommand(query)
        );
        return $metadata.httpStatusCode === 200;
    }

    async get(gameName, guid): Promise<IClip | null> {
        const query = {
            TableName: this.tableName,
            Key: marshall({ pk: gameName, sk: getSk(gameName, guid) }),
        };
        console.log('getQuery>', query);
        const { Item } = await this.docClient
            .send(new GetItemCommand(query))
            .catch(logIt);
        if (!Item) {
            console.log('No records returned for', getSk(gameName, guid));
            return null;
        }
        return unmarshall(Item) as IClip;
    }

    /**
     * much deeper abstraction here however I think it will be much easier to implement in the
     * other repos and it is robust enough to cover all of the short term needs i foresaw.
     *
     * @param gameName
     * @param filter YOU CAN ONLY CHOSE 1 HERE
     * @param comparator
     * @param minimumRating
     * @param includeUsedInVideo
     * @param includeUsedInShort
     */
    async getByCustomDate(
        gameName: string,
        filter: ICustomDateFilter,
        comparator: Comparator, //todo this and filter can be combined in an obj, and rating can have its own comparator too
        minimumRating: number = 7,
        includeUsedInVideo: boolean = false,
        includeUsedInShort: boolean = false
    ) {
        const {
            FilterExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
            KeyConditionExpression,
        } = DateExpressionMapper(
            gameName,
            filter,
            comparator,
            minimumRating,
            includeUsedInVideo,
            includeUsedInShort
        );
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression,
            FilterExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues,
        };
        console.log('getByCustomDateQuery>', query);
        const { Items } = await this.docClient
            .send(new QueryCommand(query))
            .catch(logIt);
        return unmarshall(Items);
    }

    async getByFolder(folder: string, gameName: string): Promise<IClip[]> {
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression: 'pk = :pk',
            FilterExpression: `contains(s3Path, :folder)`,
            ExpressionAttributeValues: marshall({
                ':pk': gameName,
                ':folder': folder,
            }),
        };
        console.log('getByFolderQuery>', query);
        const { Items } = await this.docClient
            .send(new QueryCommand(query))
            .catch(logIt);
        return Items.map(unmarshall);
    }

    async getUsedInShort(gameName: string): Promise<IClip[]> {
        const query = {
            TableName: this.tableName,
            ScanIndexForward: true,
            KeyConditionExpression: 'pk = :pk',
            FilterExpression: `attribute_exists(usedInShortAtDate)`,
            ExpressionAttributeValues: marshall({
                ':pk': gameName,
            }),
        };
        console.log('getUsedInShortQuery>', query);
        const { Items } = await this.docClient.send(new QueryCommand(query));
        return Items.map(unmarshall);
    }

    async getByS3Path(gameName: string, s3Path: string): Promise<IClip> {
        return this.getByEquality(gameName, { s3Path }, true);
    }
}
