"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectToExpressionAttributeValues = exports.objectToEqualityFilterExpression = exports.DateExpressionMapper = exports.getKeyConditionExpression = exports.getExpressionAttributeValues = exports.getExpressionAttributeNames = exports.getFilterExpression = exports.columnNameKeyValueMaps = exports.getSk = exports.preMarshallPrep = void 0;
const constants_1 = require("../constants");
const util_dynamodb_1 = require("@aws-sdk/util-dynamodb");
const preMarshallPrep = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
};
exports.preMarshallPrep = preMarshallPrep;
const getSk = (gameName, guid) => `${gameName}${constants_1.SK_SEPARATOR}${guid}`;
exports.getSk = getSk;
exports.columnNameKeyValueMaps = Object.freeze({
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
const getFilterExpression = (filter, expression, minimumRating, includeUsedInVideo, includeUsedInShort) => {
    const columnName = Object.keys(filter)?.[0];
    const map = exports.columnNameKeyValueMaps[columnName];
    const ratingMap = exports.columnNameKeyValueMaps['minimumRating'];
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
exports.getFilterExpression = getFilterExpression;
const getExpressionAttributeNames = (filter) => {
    const columnName = Object.keys(filter)?.[0];
    const map = exports.columnNameKeyValueMaps[columnName];
    const ratingMap = exports.columnNameKeyValueMaps['minimumRating'];
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
exports.getExpressionAttributeNames = getExpressionAttributeNames;
const getExpressionAttributeValues = (gameName, filter, minimumRating) => {
    const columnName = Object.keys(filter)?.[0];
    const map = exports.columnNameKeyValueMaps[columnName];
    const ratingMap = exports.columnNameKeyValueMaps['minimumRating'];
    return {
        ':pk': gameName,
        [map.Value]: filter[columnName],
        [ratingMap.Value]: minimumRating,
    };
};
exports.getExpressionAttributeValues = getExpressionAttributeValues;
const getKeyConditionExpression = (gameName, filter, expression) => {
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
exports.getKeyConditionExpression = getKeyConditionExpression;
const DateExpressionMapper = (gameName, filter, expression, minimumRating, usedInVideo, usedInShort) => ({
    FilterExpression: (0, exports.getFilterExpression)(filter, expression, minimumRating, usedInVideo, usedInShort),
    ExpressionAttributeNames: (0, exports.getExpressionAttributeNames)(filter),
    ExpressionAttributeValues: (0, util_dynamodb_1.marshall)((0, exports.getExpressionAttributeValues)(gameName, filter, minimumRating)),
    KeyConditionExpression: (0, exports.getKeyConditionExpression)(gameName, filter, expression),
});
exports.DateExpressionMapper = DateExpressionMapper;
const objectToEqualityFilterExpression = (object) => {
    return Object.keys(object)
        .map((key) => `${key} = :${key}`)
        .join(' AND ');
};
exports.objectToEqualityFilterExpression = objectToEqualityFilterExpression;
const objectToExpressionAttributeValues = (object) => {
    return Object.entries(object).reduce((acc, [key, value]) => {
        return {
            ...acc,
            [`:${key}`]: value,
        };
    }, {});
};
exports.objectToExpressionAttributeValues = objectToExpressionAttributeValues;
//# sourceMappingURL=dynamoUtils.js.map