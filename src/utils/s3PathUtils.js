"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addParentFolder = exports.updateS3PathFolder = exports.createS3Path = exports.createPath = void 0;
const createPath = (...args) => args.join('/');
exports.createPath = createPath;
const createS3Path = (folder, gameName, filename, parentFolder = null) => parentFolder
    ? (0, exports.createPath)(folder, gameName, parentFolder, filename)
    : (0, exports.createPath)(folder, gameName, filename);
exports.createS3Path = createS3Path;
const updateS3PathFolder = (toFolder, s3Path) => {
    const parts = s3Path.split('/');
    parts[0] = toFolder;
    return parts.join('/');
};
exports.updateS3PathFolder = updateS3PathFolder;
const addParentFolder = (parentFolder, s3Path) => {
    const parts = s3Path.split('/');
    return (0, exports.createPath)(parts[0], parts[1], parentFolder, parts[2]);
};
exports.addParentFolder = addParentFolder;
//# sourceMappingURL=s3PathUtils.js.map