"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagsRepo = exports.clipsRepo = void 0;
const constants_1 = require("./src/constants");
const clipsRepository_1 = require("./src/repositories/clipsRepository");
const tagsRepository_1 = require("./src/repositories/tagsRepository");
__exportStar(require("./src/repositories/tagsRepository"), exports);
__exportStar(require("./src/repositories/clipsRepository"), exports);
__exportStar(require("./src/utils/clipsDataStoreUtils"), exports);
__exportStar(require("./src/utils/dateUtils"), exports);
exports.clipsRepo = new clipsRepository_1.ClipsRepository({
    region: constants_1.AWS_REGION,
    envName: constants_1.DYNAMO_ENV_NAME,
});
exports.tagsRepo = new tagsRepository_1.TagsRepository({
    region: constants_1.AWS_REGION,
    envName: constants_1.DYNAMO_ENV_NAME,
});
__exportStar(require("./src/interfaces"), exports);
__exportStar(require("./src/utils/clipEntityUtils"), exports);
__exportStar(require("./src/utils/s3PathUtils"), exports);
//# sourceMappingURL=index.js.map