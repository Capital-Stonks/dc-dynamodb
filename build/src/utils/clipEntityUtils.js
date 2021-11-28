"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClipEntity = void 0;
const uuid_1 = require("uuid");
const s3PathUtils_1 = require("./s3PathUtils");
const dateUtils_1 = require("./dateUtils");
const createClipEntity = (gameName, folder, columns, fileExtension = 'mp4') => {
    const guid = (0, uuid_1.v4)();
    return {
        guid,
        gameName,
        createdAt: (0, dateUtils_1.dateEst)(),
        s3Path: (0, s3PathUtils_1.createS3Path)(folder, gameName, `${guid}.${fileExtension}`),
        ...columns,
    };
};
exports.createClipEntity = createClipEntity;
//# sourceMappingURL=clipEntityUtils.js.map