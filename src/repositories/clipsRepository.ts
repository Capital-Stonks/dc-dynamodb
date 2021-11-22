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
import {
    dateEst,
    DateExpressionMapper,
    getSk,
    preMarshallPrep,
} from '../utils/dynamoUtils';
import { logIt } from '../utils/logItUtils';

export class ClipsRepository extends Repository {
    public tableName;
    public static gsi = 'ratedAtDate-index';

    constructor(config = { region: 'us-east-2', envName: DYNAMO_ENV_NAME }) {
        super(config);
        this.tableName = `${config.envName}-clips`;
    }

    async create(createObject: IClip): Promise<Boolean> {
        const {
            gameName,
            s3Path,
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
            s3Path,
            guid,
            aggregatedAtDate,
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
            createdAt: dateEst(),
        });

        const { $metadata } = await this.docClient
            .send(
                new PutItemCommand({
                    TableName: this.tableName,
                    Item: marshall(filteredPut),
                })
            )
            .catch(logIt);
        return $metadata.httpStatusCode === 200;
    }

    async put(putObject: IClip): Promise<Boolean> {
        const {
            gameName,
            guid,
            username,
            s3Path,
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
            s3Path,
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

        const { $metadata } = await this.docClient
            .send(
                new PutItemCommand({
                    TableName: this.tableName,
                    Item: marshall(filteredPut),
                })
            )
            .catch(logIt);
        return $metadata.httpStatusCode === 200;
    }

    async delete(gameName, guid): Promise<Boolean> {
        const { $metadata } = await this.docClient.send(
            new DeleteItemCommand({
                TableName: this.tableName,
                Key: marshall({ pk: gameName, sk: getSk(gameName, guid) }),
            })
        );
        return $metadata.httpStatusCode === 200;
    }

    async get(gameName, guid): Promise<IClip | null> {
        const { Item } = await this.docClient
            .send(
                new GetItemCommand({
                    TableName: this.tableName,
                    Key: marshall({ pk: gameName, sk: getSk(gameName, guid) }),
                })
            )
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
        const { Items } = await this.docClient
            .send(
                new QueryCommand({
                    TableName: this.tableName,
                    ScanIndexForward: true,
                    KeyConditionExpression,
                    FilterExpression,
                    ExpressionAttributeNames,
                    ExpressionAttributeValues,
                })
            )
            .catch(logIt);
        return unmarshall(Items);
    }

    async getByFolder(folder: string, gameName: string): Promise<IClip[]> {
        const { Items } = await this.docClient
            .send(
                new QueryCommand({
                    TableName: this.tableName,
                    ScanIndexForward: true,
                    KeyConditionExpression: 'pk = :pk',
                    FilterExpression: `contains(s3Path, :folder)`,
                    ExpressionAttributeValues: marshall({
                        ':pk': gameName,
                        ':folder': folder,
                    }),
                })
            )
            .catch(logIt);
        return Items.map(unmarshall);
    }

    async getUsedInShort(gameName: string): Promise<IClip[]> {
        const { Items } = await this.docClient.send(
            new QueryCommand({
                TableName: this.tableName,
                ScanIndexForward: true,
                KeyConditionExpression: 'pk = :pk',
                FilterExpression: `attribute_exists(usedInShortAtDate)`,
                ExpressionAttributeValues: marshall({
                    ':pk': gameName,
                }),
            })
        );
        return Items.map(unmarshall);
    }
}
