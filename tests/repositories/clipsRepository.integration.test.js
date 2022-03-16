"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ORIG_ENV = { ...process.env };
process.env.NODE_ENV = 'development';
const clipsRepository_1 = require("../../src/repositories/clipsRepository");
const factory_1 = require("../factory");
describe('clipsRepository', () => {
    const clip1 = (0, factory_1.clipFactory)({
        s3Path: 'folder1/valorant/file1',
        usedInShortAtDate: undefined,
        ratedAt: '2022-01-01 00:00:00.000Z',
    });
    const clip2 = (0, factory_1.clipFactory)({
        s3Path: 'folder2/valorant/file2',
        usedInShortAtDate: undefined,
    });
    const clip3 = (0, factory_1.clipFactory)({ s3Path: 'folder3/valorant/file3' });
    const clipRepo = new clipsRepository_1.ClipsRepository();
    beforeAll(async () => {
        await clipRepo.create(clip1);
        await clipRepo.create(clip2);
        await clipRepo.create(clip3);
    });
    afterAll(async () => {
        process.env = { ...ORIG_ENV };
        await clipRepo.delete(clip1.gameName, clip1.guid);
        await clipRepo.delete(clip2.gameName, clip2.guid);
        await clipRepo.delete(clip3.gameName, clip3.guid);
    });
    describe('getByFolder', () => {
        test('returns items by folder & gameName', async () => {
            const clips = await clipRepo.getByFolder('folder1', 'valorant');
            expect(clips.length).toBe(1);
            expect(clips[0].guid).toBe(clip1.guid);
        });
    });
    describe('getUsedInShort', () => {
        test('returns entities that have been used in a short', async () => {
            const usedInShort = await clipRepo.getUsedInShort('valorant');
            expect(Array.isArray(usedInShort)).toBe(true);
            expect(usedInShort[0].guid).toBe(clip3.guid);
        });
    });
    describe('getPreProcessShortsByDate', () => {
        test('returns entities that have been used in a short', async () => {
            const usedInShort = await clipRepo.getPreProcessShortsByDate('valorant', '2022-01-01');
            expect(usedInShort.length).toBe(1);
            expect(usedInShort[0].guid).toBe(clip1.guid);
        });
    });
    describe('getByS3Path', () => {
        test('returns entities by s3 path', async () => {
            const entity = await clipRepo.getByS3Path('valorant', clip1.s3Path);
            expect(entity.guid).toBe(clip1.guid);
        });
    });
});
//# sourceMappingURL=clipsRepository.integration.test.js.map