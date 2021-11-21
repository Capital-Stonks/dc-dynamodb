import * as fs from 'fs';
import * as AWS from 'aws-sdk';
import { BUCKET_NAME } from '../constants';

export const s3 = new AWS.S3();

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

export const getObject = (s3Key: string) => {
    return s3
        .getObject({
            Bucket: BUCKET_NAME,
            Key: s3Key,
        })
        .promise()
        .catch(() => null);
};

export const moveObject = async (fromS3Path, toS3Path) => {
    return copyObject(fromS3Path, toS3Path).then(() =>
        deleteObject(fromS3Path)
    );
};

export const copyObject = async (sourceKey, destKey) => {
    const options = {
        Bucket: BUCKET_NAME,
        CopySource: `${BUCKET_NAME}/${sourceKey}`,
        Key: destKey,
    };
    return s3.copyObject(options).promise();
};

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

export const deleteObject = (s3Key) => {
    const options = {
        Bucket: BUCKET_NAME,
        Key: s3Key,
    };
    return s3.deleteObject(options).promise();
};
