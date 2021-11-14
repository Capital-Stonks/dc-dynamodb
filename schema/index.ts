

export const videoTableSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S',
        },
        {
            AttributeName: 'game',
            AttributeType: 'S',
        },
        {
            AttributeName: 'videoUrl',
            AttributeType: 'S',
        },
    ],
    LocalSecondaryIndexes: [
        {
            IndexName: 'ForeignLanguageSupportIndex',
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' },
                { AttributeName: 'game', KeyType: 'RANGE' },
            ],
            Projection: {
                ProjectionType: 'ALL',
            },
        },
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH',
        },
        {
            AttributeName: 'videoUrl',
            KeyType: 'RANGE',
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
    TableName: 'Videos',
};

export const tagsTableSchema = {
    AttributeDefinitions: [
        {
            AttributeName: 'id',
            AttributeType: 'S',
        },
        {
            AttributeName: 'game',
            AttributeType: 'S',
        },
        {
            AttributeName: 'videoUrl',
            AttributeType: 'S',
        },
    ],
    KeySchema: [
        {
            AttributeName: 'id',
            KeyType: 'HASH',
        },
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5,
    },
    TableName: 'Tags',
};
