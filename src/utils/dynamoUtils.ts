import { SK_SEPARATOR } from '../constants';
import { IColumnNameMap, ICustomDateFilter } from '../interfaces';
import { marshall } from '@aws-sdk/util-dynamodb';

export const preMarshallPrep = (obj) => {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, v]) => v !== undefined)
    );
};

export const getSk = (gameName, guid) => `${gameName}${SK_SEPARATOR}${guid}`;

export const columnNameKeyValueMaps: { [key: string]: IColumnNameMap } =
    Object.freeze({
        ratedAtDate: {
            Name: `ratedAtDate`,
            Key: '#ratedAtDate',
            Value: ':ratedAtDate',
        },
        usedInVideoAtDate: {
            Name: 'usedInVideoAtDate',
            Key: '#usedInVideoAtDate',
            Value: ':usedInVideoAtDate',
        },
        aggregatedAtDate: {
            Name: 'aggregatedAtDate',
            Key: '#aggregatedAtDate',
            Value: ':aggregatedAtDate',
        },
        usedInShortAtDate: {
            Name: 'usedInShortAtDate',
            Key: '#usedInShortAtDate',
            Value: ':usedInShortAtDate',
        },
        minimumRating: {
            Name: 'rating',
            Key: '#rating',
            Value: ':rating',
        },
    });

export const getFilterExpression = (
    filter: ICustomDateFilter,
    expression,
    minimumRating,
    includeUsedInVideo,
    includeUsedInShort
) => {
    const columnName = Object.keys(filter)?.[0];
    const map = columnNameKeyValueMaps[columnName];
    const ratingMap = columnNameKeyValueMaps['minimumRating'];
    let filterExpression = `${map.Key} ${expression} ${map.Value} `;

    if (minimumRating) {
        filterExpression += `AND ${ratingMap.Key} >= ${ratingMap.Value} `;
    }
    if (!includeUsedInVideo) {
        filterExpression += 'AND attribute_not_exists(usedInVideoAtDate) ';
    }
    if (!includeUsedInShort) {
        filterExpression += 'AND attribute_not_exists(usedInShortAtDate) ';
    }

    return filterExpression;
};

export const getExpressionAttributeNames = (filter: ICustomDateFilter) => {
    const columnName = Object.keys(filter)?.[0];
    const map = columnNameKeyValueMaps[columnName];
    const ratingMap = columnNameKeyValueMaps['minimumRating'];
    // todo on hold until gsi is fully solved
    // let ExpressionAttributeNames;
    // if (!map.Name === ClipsRepository.gsi){
    //     KeyConditionExpression += ` AND ${map.Name} ${expression} ${map.Value}`;
    // }
    return {
        '#pk': 'pk',
        [map.Key]: map.Name,
        [ratingMap.Key]: ratingMap.Name,
    };
};

export const getExpressionAttributeValues = (
    gameName,
    filter: ICustomDateFilter,
    minimumRating
) => {
    const columnName = Object.keys(filter)?.[0];
    const map = columnNameKeyValueMaps[columnName];
    const ratingMap = columnNameKeyValueMaps['minimumRating'];
    return {
        ':pk': gameName,
        [map.Value]: filter[columnName],
        [ratingMap.Value]: minimumRating,
    };
};

export const getKeyConditionExpression = (gameName, filter, expression) => {
    // todo on hold until gsi is fully solved
    // const columnName = Object.keys(filter)?.[0];
    // const map = columnNameKeyValueMaps[columnName];
    // let KeyConditionExpression = `#pk = :pk AND begins_with(sk, ${gameName})`;
    // if (map.Name === ClipsRepository.gsi){
    //     KeyConditionExpression += ` AND ${map.Key} ${expression} ${map.Value}`;
    // }

    //let KeyConditionExpression = `#pk = 'GLOBAL' OR #pk = 'GENRE' AND sk = 'GENRE#SHOOTER' or AND begins_with(sk, ${gameName})`;
    return '#pk = :pk';
};

export const DateExpressionMapper = (
    gameName,
    filter: ICustomDateFilter,
    expression,
    minimumRating,
    usedInVideo,
    usedInShort
) => ({
    FilterExpression: getFilterExpression(
        filter,
        expression,
        minimumRating,
        usedInVideo,
        usedInShort
    ),
    ExpressionAttributeNames: getExpressionAttributeNames(filter),
    ExpressionAttributeValues: marshall(
        getExpressionAttributeValues(gameName, filter, minimumRating)
    ),
    KeyConditionExpression: getKeyConditionExpression(
        gameName,
        filter,
        expression
    ),
});

export const objectToEqualityFilterExpression = (object: object): string => {
    return Object.keys(object)
        .map((key) => `${key} = :${key}`)
        .join(' AND ');
};

export const objectToExpressionAttributeValues = (object: object): object => {
    return Object.entries(object).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [`:${key}`]: value,
        };
    }, {});
};
