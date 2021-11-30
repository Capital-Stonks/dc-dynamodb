"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteObject = exports.createOptions = exports.putObjectFromFile = exports.copyObject = exports.moveObject = exports.getObject = exports.createPresignedUrl = exports.createPresignedUrls = exports.s3 = void 0;
const fs = __importStar(require("fs"));
const AWS = __importStar(require("aws-sdk"));
const constants_1 = require("../constants");
exports.s3 = new AWS.S3();
const createPresignedUrls = (s3Objects) => s3Objects.map(exports.createPresignedUrl);
exports.createPresignedUrls = createPresignedUrls;
const createPresignedUrl = (s3Object) => {
    const presignedUrl = exports.s3.getSignedUrl('getObject', {
        Bucket: constants_1.BUCKET_NAME,
        Key: s3Object.Key,
        Expires: 86400,
    });
    return {
        ...s3Object,
        presignedUrl,
    };
};
exports.createPresignedUrl = createPresignedUrl;
const getObject = (s3Key) => {
    return exports.s3
        .getObject({
        Bucket: constants_1.BUCKET_NAME,
        Key: s3Key,
    })
        .promise()
        .catch(() => null);
};
exports.getObject = getObject;
const moveObject = async (fromS3Path, toS3Path) => {
    return (0, exports.copyObject)(fromS3Path, toS3Path).then(() => (0, exports.deleteObject)(fromS3Path));
};
exports.moveObject = moveObject;
const copyObject = async (sourceKey, destKey) => {
    const options = {
        Bucket: constants_1.BUCKET_NAME,
        CopySource: `${constants_1.BUCKET_NAME}/${sourceKey}`,
        Key: destKey,
    };
    return exports.s3.copyObject(options).promise();
};
exports.copyObject = copyObject;
const putObjectFromFile = async (s3Key, filePath) => {
    const options = {
        Body: fs.readFileSync(filePath),
        Bucket: constants_1.BUCKET_NAME,
        Key: s3Key,
    };
    return exports.s3
        .putObject(options)
        .promise()
        .then(() => s3Key);
};
exports.putObjectFromFile = putObjectFromFile;
const createOptions = ({ key, bucket }) => ({
    Key: key,
    Bucket: bucket,
});
exports.createOptions = createOptions;
const deleteObject = (s3Key) => {
    const options = {
        Bucket: constants_1.BUCKET_NAME,
        Key: s3Key,
    };
    return exports.s3.deleteObject(options).promise();
};
exports.deleteObject = deleteObject;
//# sourceMappingURL=s3Utils.js.map