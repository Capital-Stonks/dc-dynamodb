import { TagsRepository } from '../src/repositories/tagsRepository';
import { ClipsRepository } from '../src/repositories/clipsRepository';
import { EnvName } from '../src/interfaces';
import { v4 } from 'uuid';
import { getSk } from '../src/utils/dynamoUtils';
import momentTz from 'moment-timezone';

const moment = momentTz;

jest.setTimeout(1000000);

describe('dynamo.util', () => {
    let clipsRepo;
    let tagsRepo;
    let guid = v4();
    let gameName = 'VALORANT';
    beforeAll(async () => {
        clipsRepo = new ClipsRepository();
        tagsRepo = new TagsRepository();
    });

    afterEach(async () => {
        const del = await clipsRepo.delete(gameName, getSk(gameName, guid));
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
            const query = await clipsRepo.getByCustomDate(
                gameName,
                {
                    ratedAtDate: '2021-01-01',
                    // usedInVideoAtDate: '2019-01-01',
                    // aggregatedAtDate: '2020-01-01',
                },
                clipsRepo.Comparator.eq,
                3,
                false,
                false
            );
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
