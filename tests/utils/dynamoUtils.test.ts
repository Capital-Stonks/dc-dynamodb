import * as dynamoUtil from '../../src/utils/dynamoUtils';

describe('dynamoUtil', () => {
    describe('objectToEqualityFilterExpression', () => {
        test('returns string of equalities joined with AND', () => {
            const result = dynamoUtil.objectToEqualityFilterExpression({
                pk: 'gameName',
                s3Path: 'hooblahh/filename',
            });
            expect(result).toBe('pk = :pk AND s3Path = :s3Path');
        });
    });

    describe('objectToExpressionAttributeValues', () => {
        test('parses object to expression attributes', () => {
            const result = dynamoUtil.objectToExpressionAttributeValues({
                test: 'me',
                hooblahh: 'test',
            });
            expect(result).toStrictEqual({
                ':test': 'me',
                ':hooblahh': 'test',
            });
        });
    });
});
