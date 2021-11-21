import { EnvName } from '../interfaces';

require('dotenv').config();

export const { NODE_ENV } = process.env;

export const IS_DEVELOPMENT = NODE_ENV === 'development';

export const AWS_REGION = 'us-east-2';

export const DYNAMO_ENV_NAME = IS_DEVELOPMENT
    ? EnvName.DEV
    : EnvName.PRODUCTION;

export const BUCKET_NAME = IS_DEVELOPMENT ? 'dev-pepega-clips' : 'pepega-clips';
