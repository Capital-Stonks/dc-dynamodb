import { SK_SEPARATOR } from '../../constants';
import momentTz from 'moment-timezone';
import { IColumnNameMap, ICustomDateFilter } from '../interfaces';
import { marshall } from '@aws-sdk/util-dynamodb';

const moment = momentTz;

export const preMarshallPrep = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
};

export const getSk = (gameName, guid) => `${gameName}${SK_SEPARATOR}${guid}`;

export const dateEst = () => moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS');

export const columnNameKeyValueMaps: { [key: string]: IColumnNameMap } = Object.freeze({
    ratedAtDate: {
        Name: 'ratedAtDate',
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
});

export const getFilterExpression = (filter: ICustomDateFilter, expression, includeUsedInVideo, includeUsedInShort) => {
    const columnName = Object.keys(filter)?.[0];
    const map = columnNameKeyValueMaps[columnName];
    let filterExpression = `${map.Key} ${expression} ${map.Value} `;
    if (!includeUsedInVideo){
        filterExpression += 'AND attribute_not_exists(usedInVideoAtDate) ';
    }
    if (!includeUsedInShort){
        filterExpression += 'AND attribute_not_exists(usedInShortAtDate) ';
    }
    return filterExpression;
}

export const getExpressionAttributeNames = (filter: ICustomDateFilter) => {
    const columnName = Object.keys(filter)?.[0];
    const map = columnNameKeyValueMaps[columnName];
    return {
        '#pk': 'pk',
        [map.Key]: map.Name,
    };
}

export const getExpressionAttributeValues = (gameName, filter: ICustomDateFilter) => {
    const columnName = Object.keys(filter)?.[0];
    const map = columnNameKeyValueMaps[columnName];

    return {
        ':pk': gameName,
        [map.Value]: filter[columnName],
    };
}

export const DateExpressionMapper = (gameName, filter: ICustomDateFilter, expression, usedInVideo, usedInShort) => ({
    FilterExpression: getFilterExpression(filter, expression, usedInVideo, usedInShort),
    ExpressionAttributeNames: getExpressionAttributeNames(filter),
    ExpressionAttributeValues: marshall(getExpressionAttributeValues(gameName, filter)),
})

