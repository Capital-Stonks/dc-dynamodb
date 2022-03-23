"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clipFactory = void 0;
const moment_1 = __importDefault(require("moment"));
const uuid_1 = require("uuid");
const clipFactory = (args = {}) => ({
    gameName: 'valorant',
    guid: (0, uuid_1.v4)(),
    s3Path: `some-folder/valorant/${(0, uuid_1.v4)()}.mp4`,
    username: 'integration-test',
    shortsTitle: 'some-title',
    source: 'jest',
    sourceTitle: 'Mock Entity',
    sourceDescription: 'Mock Description',
    rating: 7,
    ratedAtDate: (0, moment_1.default)()
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    usedInVideoAtDate: (0, moment_1.default)()
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    usedInShortAtDate: (0, moment_1.default)()
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    aggregatedAtDate: (0, moment_1.default)()
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    tags: ['flick', 'ace'],
    duration: 100,
    resolutionHeight: 720,
    ...args,
});
exports.clipFactory = clipFactory;
//# sourceMappingURL=factory.js.map