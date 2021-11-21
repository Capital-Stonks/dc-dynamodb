import {
    PutItemCommand,
    GetItemCommand,
    DeleteItemCommand,
    QueryCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { Repository, Comparator } from '.';
import { EnvName, ICustomDateFilter, IPutClip } from '../interfaces';
import {
    dateEst,
    DateExpressionMapper,
    getSk,
    preMarshallPrep,
} from '../utils/dynamoUtils';

export class ClipsRepository extends Repository {
    public tableName;
    public static gsi = 'ratedAtDate-index';

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
            .catch((e) => {
                console.log(e);
                return e;
            });
        return $metadata.httpStatusCode === 200;
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

        const { $metadata } = await this.docClient
            .send(
                new PutItemCommand({
                    TableName: this.tableName,
                    Item: marshall(filteredPut),
                })
            )
            .catch((e) => {
                console.log(e);
                return e;
            });
        return $metadata.httpStatusCode === 200;
    }

    async delete(gameName, guid) {
        const { $metadata } = await this.docClient.send(
            new DeleteItemCommand({
                TableName: this.tableName,
                Key: marshall({ pk: gameName, sk: getSk(gameName, guid) }),
            })
        );
        return $metadata.httpStatusCode === 200;
    }

    async get(gameName, guid) {
        const { Item } = await this.docClient
            .send(
                new GetItemCommand({
                    TableName: this.tableName,
                    Key: marshall({ pk: gameName, sk: getSk(gameName, guid) }),
                })
            )
            .catch((e) => {
                console.log(e);
                return e;
            });
        if (!Item) {
            console.log('No records returned for', getSk(gameName, guid));
            return null;
        }
        return unmarshall(Item);
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
        minimumRating: number = 6,
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
        const { Items } = this.docClient
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
            .catch((e) => {
                console.log(e);
                return e;
            });
        return unmarshall(Items);
    }
}
