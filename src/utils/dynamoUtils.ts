import { SK_SEPARATOR } from '../../constants';
import momentTz from 'moment-timezone';
import { IColumnNameMap, ICustomDateFilter } from '../interfaces';

const moment = momentTz;

export const preMarshallPrep = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
};

export const getSk = (gameName, guid) => `${gameName}${SK_SEPARATOR}${guid}`;

export const dateEst = () => moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS');

export const columnNameKeyValueMaps: { [key: string]: IColumnNameMap } = Object.freeze({
    ratedAtDateMap: {
        Name: 'ratedAtDate',
        Key: '#ratedAtDate',
        Value: ':ratedAtDate',
    },
    usedInVideoAtDateMap: {
        Name: 'usedInVideoAtDate',
        Key: '#ratedAtDate',
        Value: ':ratedAtDate',
    },
    aggregatedAtDateMap: {
        Name: 'aggregatedAtDate',
        Key: '#aggregatedAtDate',
        Value: ':aggregatedAtDate',
    },
    usedInShortAtDateMap: {
        Name: 'usedInShortAtDate',
        Key: '#usedInShortAtDate',
        Value: ':usedInShortAtDate',
    },
});

export const getFilterExpression = (filter: ICustomDateFilter, expression, usedInVideo, usedInShort) => {
    Object.entries(filter).filter(kv => {
        console.log(kv);
    })
}

