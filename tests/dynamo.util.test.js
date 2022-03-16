"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tagsRepository_1 = require("../src/repositories/tagsRepository");
const clipsRepository_1 = require("../src/repositories/clipsRepository");
const uuid_1 = require("uuid");
const dynamoUtils_1 = require("../src/utils/dynamoUtils");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const moment = moment_timezone_1.default;
jest.setTimeout(1000000);
describe('dynamo.util', () => {
    let clipsRepo;
    let tagsRepo;
    let guid = (0, uuid_1.v4)();
    let gameName = 'VALORANT';
    beforeAll(async () => {
        clipsRepo = new clipsRepository_1.ClipsRepository();
        tagsRepo = new tagsRepository_1.TagsRepository();
    });
    afterEach(async () => {
        const del = await clipsRepo.delete(gameName, (0, dynamoUtils_1.getSk)(gameName, guid));
        console.log(del);
    });
    describe('puts', () => {
        test('creates clip', async () => {
            const date = moment()
                .tz('America/New_York')
                .format('YYYY-MM-DD HH:mm:ss.SSS');
            const put = await clipsRepo.put({
                gameName,
                guid,
                username: 'jake',
                source: 'twitter',
                sourceTitle: 'most yoked ace',
                sourceDescription: 'so chad omg',
                tags: ['wow', 'ace'],
                duration: 190,
                resolutionHeight: 69,
                rating: 9,
                ratedAtDate: date,
                usedInVideoAtDate: date,
                usedInShortAtDate: date,
                aggregatedAtDate: date,
            });
            expect(put).toBeTruthy();
        });
        test('updates clip without overwriting undefined keys', async () => {
            const date = moment()
                .tz('America/New_York')
                .format('YYYY-MM-DD HH:mm:ss.SSS');
            const put = await clipsRepo.put({
                gameName,
                guid,
                username: 'jake',
                source: 'twitter',
                sourceTitle: 'most yoked ace',
                sourceDescription: 'so chad omg',
                tags: ['wow', 'ace'],
                duration: 999999,
                resolutionHeight: 69,
                rating: 9,
                ratedAtDate: date,
                usedInVideoAtDate: date,
                usedInShortAtDate: date,
                aggregatedAtDate: date,
            });
            expect(put).toBeTruthy();
            const item = await clipsRepo.get(gameName, guid);
            expect(item).toBeTruthy();
            expect(item.duration).toBe(999999);
            const putWithoutOverwritingUndefined = await clipsRepo.put({
                gameName,
                guid,
                username: 'jake',
                source: 'twitter',
                sourceTitle: 'most yoked ace',
                sourceDescription: 'so chad omg',
                tags: ['wow', 'ace'],
                duration: 12,
                resolutionHeight: 69,
                rating: 9,
                ratedAtDate: date,
                usedInVideoAtDate: date,
                aggregatedAtDate: date,
            });
            expect(putWithoutOverwritingUndefined).toBeTruthy();
            const item2 = await clipsRepo.get(gameName, guid);
            expect(item2.duration).toBe(12);
        });
    });
    describe('deletes', () => {
        test('deletes clip', async () => {
            const date = moment()
                .tz('America/New_York')
                .format('YYYY-MM-DD HH:mm:ss.SSS');
            const put = await clipsRepo.put({
                gameName,
                guid,
                username: 'jake',
                source: 'twitter',
                sourceTitle: 'most yoked ace',
                sourceDescription: 'so chad omg',
                tags: ['wow', 'ace'],
                duration: 190,
                resolutionHeight: 69,
                rating: 9,
                ratedAtDate: date,
                usedInVideoAtDate: date,
                aggregatedAtDate: date,
            });
            expect(put).toBeTruthy();
            const del = await clipsRepo.delete(gameName, guid);
            expect(del).toBeTruthy();
        });
    });
    describe('date query', () => {
        test('querys clip by date', async () => {
            const date = moment()
                .tz('America/New_York')
                .format('YYYY-MM-DD HH:mm:ss.SSS');
            const query = await clipsRepo.getByCustomDate(gameName, {
                ratedAtDate: '2021-01-01',
                // usedInVideoAtDate: '2019-01-01',
                // aggregatedAtDate: '2020-01-01',
            }, clipsRepo.Comparator.eq, 3, false, false);
            expect(query).toBeTruthy();
            const del = await clipsRepo.delete(gameName, guid);
            expect(del).toBeTruthy();
        });
    });
    describe('tags repo', () => {
        test('puts tags', async () => {
            const put = await tagsRepo.put({
                pk: 'VALORANT',
                sk: `VALORANT#`,
                tags: ['test', 'tags'],
            });
            expect(put).toBe(true);
        });
        test.only('gets tags', async () => {
            const get = await tagsRepo.get({
                pk: 'GLOBAL',
                sk: `VALORANT#`,
            });
            expect(get).toHaveProperty('tags');
        });
    });
});
//# sourceMappingURL=dynamo.util.test.js.map