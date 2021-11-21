import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import { BUCKET_NAME, S3_CONFIG } from '../constants';

export const s3 = new AWS.S3(S3_CONFIG);

export const createS3Path = (
    folder: string,
    gameName: string,
    filename: string,
    parentFolder: string | null = null
) =>
    parentFolder
        ? `${folder}/${gameName}/${parentFolder}/${filename}`
        : `${folder}/${gameName}/${filename}`;

export const createPresignedUrls = (s3Objects) =>
    s3Objects.map(createPresignedUrl);

export const createPresignedUrl = (s3Object) => {
    const presignedUrl = s3.getSignedUrl('getObject', {
        Bucket: BUCKET_NAME,
        Key: s3Object.Key,
        Expires: 86400,
    });
    return {
        ...s3Object,
        presignedUrl,
    };
};

// export const moveObjectsToParentFolder = (
//     keys: string[],
//     toFolder: string,
//     parentFolder: string,
// ) => {
//     return Promise.all(
//         keys.map((key) => {
//             const gameName = gameNameFromKey(key);
//             const filename = fileNameFromPath(key);
//             const destKey = `${toFolder}/${gameName}/${parentFolder}/${filename}`;
//             return copyObject(key, destKey);
//         })
//     ).then(() => deleteObjectsFromKeys(keys));
// };

export const moveObjectsByKeys = async (
    keys: string[],
    fromFolder: string,
    toFolder: string
) => {
    return copyObjects(keys, fromFolder, toFolder).then(() =>
        deleteObjectsFromKeys(keys, BUCKET_NAME)
    );
};

export const moveObjects = async (
    s3Objects,
    fromFolder: string,
    toFolder: string
) => {
    const keys = s3Objects.map(({ Key: key }) => key);
    return moveObjectsByKeys(keys, fromFolder, toFolder);
};

export const copyObject = async (sourceKey, destKey) => {
    const options = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${sourceKey}`,
        Key: destKey,
    };
    return s3.copyObject(options).promise();
};

export const copyObjects = async (keys, fromFolder, toFolder) =>
    Promise.all(
        keys.map((key) => copyObject(key, key.replace(fromFolder, toFolder)))
    );

export const putObjectFromFile = async (
    s3Key: string,
    filePath: string
): Promise<string> => {
    const options = {
        Body: fs.readFileSync(filePath),
        Bucket: BUCKET_NAME,
        Key: s3Key,
    };
    return s3
        .putObject(options)
        .promise()
        .then(() => s3Key);
};

export const createOptions = ({ key, bucket }) => ({
    Key: key,
    Bucket: bucket,
});

export const deleteObjects = async (s3Objects, bucket = BUCKET_NAME) => {
    if (!s3Objects.length) {
        return;
    }

    const options = {
        Bucket: bucket,
        Delete: {
            Objects: s3Objects.map(({ Key: key }) => ({
                Key: key,
            })),
        },
    };
    return s3.deleteObjects(options).promise();
};

export const deleteObject = (s3Key, bucket = BUCKET_NAME) => {
    const options = {
        Bucket: bucket,
        Key: s3Key,
    };
    return s3.deleteObject(options).promise();
};

const deleteObjectsFromKeys = async (keys, bucket = BUCKET_NAME) => {
    if (!keys.length) {
        return;
    }

    const options = {
        Bucket: bucket,
        Delete: {
            Objects: keys.map((key) => ({
                Key: key,
            })),
        },
    };
    return s3.deleteObjects(options).promise();
};
