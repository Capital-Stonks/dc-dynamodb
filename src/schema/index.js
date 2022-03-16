"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsTableSchema = exports.clipsTableSchema = void 0;
const clipsTableSchema = (envName) => ({
    TableName: `${envName}-clips`,
    KeySchema: [
        {
            KeyType: 'HASH',
            AttributeName: 'pk',
        },
        {
            KeyType: 'RANGE',
            AttributeName: 'sk',
        },
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'pk',
            AttributeType: 'S',
        },
        {
            AttributeName: 'sk',
            AttributeType: 'S',
        },
    ],
    // GlobalSecondaryIndexes: [ todo on hold until gsi is fully solved
    //     {
    //         IndexName: 'ratedAtDate-index',
    //         Projection: {
    //             ProjectionType: 'ALL',
    //         },
    //         KeySchema: [
    //             {
    //                 AttributeName: 'ratedAtDate',
    //                 KeyType: 'HASH',
    //             },
    //         ],
    //         BillingMode: 'PAY_PER_REQUEST',
    //         ProvisionedThroughput: {
    //             ReadCapacityUnits: 1,
    //             WriteCapacityUnits: 1,
    //         },
    //     },
    // ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
});
exports.clipsTableSchema = clipsTableSchema;
const tagsTableSchema = (envName) => ({
    TableName: `${envName}-tags`,
    KeySchema: [
        {
            KeyType: 'HASH',
            AttributeName: 'pk',
        },
    ],
    AttributeDefinitions: [
        {
            AttributeName: 'pk',
            AttributeType: 'S',
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
});
exports.tagsTableSchema = tagsTableSchema;
//# sourceMappingURL=index.js.map