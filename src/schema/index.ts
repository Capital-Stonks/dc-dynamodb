export const clipsTableSchema = (envName) => ({
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
        {
            AttributeName: 'ratedAtDate',
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
        ReadCapacityUnits: 30,
        WriteCapacityUnits: 1,
    },
});

export const tagsTableSchema = (envName) => ({
    TableName: `${envName}-tags`,
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

    ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
    },
});
