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
exports.deleteClip = exports.moveClip = exports.updateClip = exports.createClip = void 0;
const constants_1 = require("../constants");
const interfaces_1 = require("../interfaces");
const clipsRepository_1 = require("../repositories/clipsRepository");
const s3Util = __importStar(require("./s3Utils"));
const s3PathUtils = __importStar(require("./s3PathUtils"));
const clipRepo = new clipsRepository_1.ClipsRepository({
    region: constants_1.AWS_REGION,
    envName: interfaces_1.EnvName.DEV,
});
const createClip = async (clip, filePath) => {
    await clipRepo.create(clip);
    return s3Util.putObjectFromFile(clip.s3Path, filePath).then(() => clip);
};
exports.createClip = createClip;
const updateClip = async (clip, filePath, oldS3Path) => {
    await clipRepo.put(clip);
    await s3Util.putObjectFromFile(clip.s3Path, filePath);
    return s3Util.deleteObject(oldS3Path).then(() => clip);
};
exports.updateClip = updateClip;
const moveClip = async (clip, toFolder, parentFolder = null) => {
    let newS3Path = s3PathUtils.updateS3PathFolder(toFolder, clip.s3Path);
    if (parentFolder) {
        newS3Path = s3PathUtils.addParentFolder(parentFolder, newS3Path);
    }
    const newClip = {
        ...clip,
        s3Path: newS3Path,
    };
    await clipRepo.put(newClip);
    return s3Util.moveObject(clip.s3Path, newS3Path).then(() => newClip);
};
exports.moveClip = moveClip;
const deleteClip = async (clip) => {
    clipRepo.delete(clip.gameName, clip.guid);
    return s3Util.deleteObject(clip.s3Path);
};
exports.deleteClip = deleteClip;
//# sourceMappingURL=clipsDataStoreUtils.js.map