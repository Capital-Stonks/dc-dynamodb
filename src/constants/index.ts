import { EnvName } from '../interfaces';

require('dotenv').config();

// @ts-ignore
export const { DYNAMO_CONFIG, S3_CONFIG } = process;

export const { NODE_ENV } = process.env;

export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';

export const AWS_REGION = 'us-east-2';

export const DYNAMO_ENV_NAME = IS_PRODUCTION ? EnvName.PRODUCTION : EnvName.DEV;

export const BUCKET_NAME = IS_DEVELOPMENT ? 'dev-pepega-clips' : 'pepega-clips';

export const SK_SEPARATOR = '#';

export const DEFAULT_LIMIT = 10000;
