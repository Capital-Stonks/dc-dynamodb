"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SK_SEPARATOR = exports.BUCKET_NAME = exports.DYNAMO_ENV_NAME = exports.AWS_REGION = exports.IS_DEVELOPMENT = exports.NODE_ENV = void 0;
const interfaces_1 = require("../interfaces");
require('dotenv').config();
exports.NODE_ENV = process.env.NODE_ENV;
exports.IS_DEVELOPMENT = exports.NODE_ENV === 'development';
exports.AWS_REGION = 'us-east-2';
exports.DYNAMO_ENV_NAME = exports.IS_DEVELOPMENT
    ? interfaces_1.EnvName.DEV
    : interfaces_1.EnvName.PRODUCTION;
exports.BUCKET_NAME = exports.IS_DEVELOPMENT ? 'dev-pepega-clips' : 'pepega-clips';
exports.SK_SEPARATOR = '#';
//# sourceMappingURL=index.js.map