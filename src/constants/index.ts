require('dotenv').config();
import * as AWS from 'aws-sdk';

export const { NODE_ENV } = process.env;

export const IS_DEVELOPMENT = NODE_ENV === 'development';

export const S3_CONFIG = IS_DEVELOPMENT
    ? {
          s3ForcePathStyle: true,
          accessKeyId: 'S3RVER', // This specific key is required when working offline
          secretAccessKey: 'S3RVER',
          endpoint: new AWS.Endpoint('http://localhost:8003'),
          region: 'us-east-2',
      }
    : {};

export const BUCKET_NAME = 'pepega-clips';
