"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preMarshallClip = exports.createClipEntity = void 0;
const uuid_1 = require("uuid");
const s3PathUtils_1 = require("./s3PathUtils");
const dateUtils_1 = require("./dateUtils");
const dynamoUtils_1 = require("./dynamoUtils");
const createClipEntity = (gameName, folder, columns, fileExtension = 'mp4', guid = (0, uuid_1.v4)(), s3Path = undefined) => {
    return {
        guid,
        gameName,
        createdAt: (0, dateUtils_1.dateEst)(),
        s3Path: s3Path || (0, s3PathUtils_1.createS3Path)(gameName, folder, guid, fileExtension),
        ...columns,
        aggregatedAtDate: (0, dateUtils_1.dateEst)(),
    };
};
exports.createClipEntity = createClipEntity;
const preMarshallClip = (clip, options) => {
    const gameName = clip.gameName || clip.pk;
    return (0, dynamoUtils_1.preMarshallPrep)({
        pk: gameName,
        sk: (0, dynamoUtils_1.getSk)(gameName, clip.guid),
        ...(options.isAddCreatedAt && { createdAt: (0, dateUtils_1.dateEst)() }),
        ...(options.isAddUpdatedAt && { updatedAt: (0, dateUtils_1.dateEst)() }),
        ...clip,
    });
};
exports.preMarshallClip = preMarshallClip;
//# sourceMappingURL=clipEntityUtils.js.map