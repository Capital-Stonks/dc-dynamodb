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
const clipsDataStore = __importStar(require("../../src/utils/clipsDataStoreUtils"));
const uuid_1 = require("uuid");
const index_1 = require("../../index");
const s3Util = __importStar(require("../../src/utils/s3Utils"));
const dynamoUtils_1 = require("../../src/utils/dynamoUtils");
const MOCK_FILE_PATH = `${__dirname}/../mocks/mock.mp4`;
jest.setTimeout(100000000);
describe('clipsDataStoreUtils', () => {
    describe('createClip', () => {
        const guid = (0, uuid_1.v4)();
        const s3Path = 'integration-test/valorant/create.mp4';
        afterAll(async () => {
            await index_1.clipsRepo.delete('valorant', guid);
            await s3Util.deleteObject(s3Path);
        });
        test('creates a clip and uploads file to s3 & returns IClip interface', async () => {
            const clip = {
                gameName: 'valorant',
                guid,
                s3Path,
                username: 'integration-test',
                source: 'jest',
                sourceTitle: 'Mock Entity',
                sourceDescription: 'Mock Description',
                rating: 7,
                ratedAtDate: (0, dynamoUtils_1.getDateNow)(),
                usedInVideoAtDate: (0, dynamoUtils_1.getDateNow)(),
                usedInShortAtDate: (0, dynamoUtils_1.getDateNow)(),
                aggregatedAtDate: (0, dynamoUtils_1.getDateNow)(),
                tags: ['flick', 'ace'],
                duration: 100,
                resolutionHeight: 720,
            };
            const response = await clipsDataStore.createClip(clip, MOCK_FILE_PATH);
            expect(response.guid).toBe(clip.guid);
            const createdClip = (await index_1.clipsRepo.get('valorant', guid));
            expect(createdClip.pk).toBe(clip.gameName);
            expect(createdClip.s3Path).toBe(clip.s3Path);
            expect(createdClip.tags).toStrictEqual(['flick', 'ace']);
            const s3Object = await s3Util.getObject(s3Path);
            expect(s3Object && s3Object.ETag).toBeTruthy();
        });
    });
    describe('updateClip', () => {
        const clip = {
            gameName: 'valorant',
            guid: (0, uuid_1.v4)(),
            s3Path: 'folder/valorant/update-me',
            username: 'integration-test',
            source: 'jest',
            sourceTitle: 'Mock Entity',
            sourceDescription: 'Mock Description',
            rating: 7,
            ratedAtDate: (0, dynamoUtils_1.getDateNow)(),
            usedInVideoAtDate: (0, dynamoUtils_1.getDateNow)(),
            usedInShortAtDate: (0, dynamoUtils_1.getDateNow)(),
            aggregatedAtDate: (0, dynamoUtils_1.getDateNow)(),
            tags: ['flick', 'ace'],
            duration: 100,
            resolutionHeight: 720,
        };
        beforeAll(async () => {
            await clipsDataStore.createClip(clip, MOCK_FILE_PATH);
        });
        afterAll(async () => {
            await index_1.clipsRepo.delete('valorant', clip.guid);
            await s3Util.deleteObject('folder/valorant/ive-been-updated');
        });
        test('updates dynamo entity and uploads a new file to s3 and deletes old s3 file', async () => {
            const update = {
                ...clip,
                s3Path: 'folder/valorant/ive-been-updated',
                rating: 9,
            };
            const updatedClip = await clipsDataStore.updateClip(update, MOCK_FILE_PATH, clip.s3Path);
            expect(updatedClip.guid).toBe(clip.guid);
            const fetchedUpdatedClip = (await index_1.clipsRepo.get('valorant', clip.guid));
            expect(fetchedUpdatedClip.rating).toBe(update.rating);
            expect(fetchedUpdatedClip.s3Path).toBe(update.s3Path);
            const s3Object = await s3Util.getObject(update.s3Path);
            expect(s3Object).toBeTruthy();
            const deletedS3Object = await s3Util.getObject(clip.s3Path);
            expect(deletedS3Object).toBe(null);
        });
    });
    describe('moveClip', () => {
        const clip = {
            gameName: 'valorant',
            guid: (0, uuid_1.v4)(),
            s3Path: 'folder/valorant/move-me!',
            username: 'integration-test',
            source: 'jest',
            sourceTitle: 'Mock Entity',
            sourceDescription: 'Mock Description',
            rating: 7,
            ratedAtDate: (0, dynamoUtils_1.getDateNow)(),
            usedInVideoAtDate: (0, dynamoUtils_1.getDateNow)(),
            usedInShortAtDate: (0, dynamoUtils_1.getDateNow)(),
            aggregatedAtDate: (0, dynamoUtils_1.getDateNow)(),
            tags: ['flick', 'ace'],
            duration: 100,
            resolutionHeight: 720,
        };
        beforeAll(async () => {
            await clipsDataStore.createClip(clip, MOCK_FILE_PATH);
        });
        afterAll(async () => {
            await index_1.clipsRepo.delete('valorant', clip.guid);
            await s3Util.deleteObject('new-folder/valorant/move-me!');
        });
        test('moves s3 objects and updates dynamo entry', async () => {
            const movedClip = await clipsDataStore.moveClip(clip, 'new-folder');
            console.log(movedClip);
            expect(movedClip.s3Path).toBe('new-folder/valorant/move-me!');
            const s3Object = await s3Util.getObject(movedClip.s3Path);
            console.log(s3Object);
            expect(s3Object).toBeTruthy();
            const deletedS3Object = await s3Util.getObject(clip.s3Path);
            expect(deletedS3Object).toBe(null);
            const fetchedUpdatedClip = (await index_1.clipsRepo.get('valorant', clip.guid));
            expect(fetchedUpdatedClip.s3Path).toBe('new-folder/valorant/move-me!');
        });
    });
    describe('deleteClip', () => {
        const clip = {
            gameName: 'valorant',
            guid: (0, uuid_1.v4)(),
            s3Path: 'folder/valorant/delete-me',
            username: 'integration-test',
            source: 'jest',
            sourceTitle: 'Mock Entity',
            sourceDescription: 'Mock Description',
            rating: 7,
            ratedAtDate: (0, dynamoUtils_1.getDateNow)(),
            usedInVideoAtDate: (0, dynamoUtils_1.getDateNow)(),
            usedInShortAtDate: (0, dynamoUtils_1.getDateNow)(),
            aggregatedAtDate: (0, dynamoUtils_1.getDateNow)(),
            tags: ['flick', 'ace'],
            duration: 100,
            resolutionHeight: 720,
        };
        beforeAll(async () => {
            await clipsDataStore.createClip(clip, MOCK_FILE_PATH);
        });
        test('deletes dynamo entity and s3 object', async () => {
            await clipsDataStore.deleteClip(clip);
            const deletedS3Object = await s3Util.getObject(clip.s3Path);
            expect(deletedS3Object).toBe(null);
            const fetchedUpdatedClip = (await index_1.clipsRepo.get('valorant', clip.guid));
            expect(fetchedUpdatedClip).toBe(null);
        });
    });
});
//# sourceMappingURL=clipsDataStoreUtils.integration.test.js.map