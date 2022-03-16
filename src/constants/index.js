"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_LIMIT = exports.SK_SEPARATOR = exports.BUCKET_NAME = exports.DYNAMO_ENV_NAME = exports.AWS_REGION = exports.IS_PRODUCTION = exports.IS_DEVELOPMENT = exports.NODE_ENV = exports.S3_CONFIG = exports.DYNAMO_CONFIG = void 0;
const interfaces_1 = require("../interfaces");
require('dotenv').config();
// @ts-ignore
exports.DYNAMO_CONFIG = process.DYNAMO_CONFIG, exports.S3_CONFIG = process.S3_CONFIG;
exports.NODE_ENV = process.env.NODE_ENV;
exports.IS_DEVELOPMENT = exports.NODE_ENV === 'development';
exports.IS_PRODUCTION = exports.NODE_ENV === 'production';
exports.AWS_REGION = 'us-east-2';
exports.DYNAMO_ENV_NAME = exports.IS_PRODUCTION ? interfaces_1.EnvName.PRODUCTION : interfaces_1.EnvName.DEV;
exports.BUCKET_NAME = exports.IS_DEVELOPMENT ? 'dev-pepega-clips' : 'pepega-clips';
exports.SK_SEPARATOR = '#';
exports.DEFAULT_LIMIT = 10000;
//# sourceMappingURL=index.js.map