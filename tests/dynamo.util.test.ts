import { ClipsRepository, TagsRepository } from '../src/index';
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
        const dbConfig = { region: 'us-east-2', envName: EnvName.DEV };
        clipsRepo = new ClipsRepository(dbConfig);
        tagsRepo = new TagsRepository(dbConfig);
    });

    afterEach(async () => {
        const del = await clipsRepo.delete(gameName, getSk(gameName, guid));
        console.log(del);
    });

    describe('puts', () => {
        test('creates clip', async () => {
            const date = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS');

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
            const date = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS');

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
            const date = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS');
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
            const del = await clipsRepo.delete(
                gameName,
                guid,
            );
            expect(del).toBeTruthy();
        });
    });

    describe('date query', () => {
        test('querys clip by date', async () => {
            const date = moment().tz('America/New_York').format('YYYY-MM-DD HH:mm:ss.SSS');
            const query = await clipsRepo.getByCustomDate(
                gameName,
                {
                    ratedAtDate: '2021-01-01',
                    // usedInVideoAtDate: '2019-01-01',
                    // aggregatedAtDate: '2020-01-01',
                },
                clipsRepo.Expression.eq,
                '3',
                false,
                false,
            );
            expect(query).toBeTruthy();
            const del = await clipsRepo.delete(
                gameName,
                guid,
            );
            expect(del).toBeTruthy();
        });
    });
    describe('tags repo', () => {
        test.only('puts tags', async () => {
            const put = await tagsRepo.put({
                pk: 'VALORANT',
                sk: `VALORANT#`,
                tags: ['test', 'tags'],
            });
            expect(put).toBe(true);
        });

        test.only('gets tags', async () => {
            const put = await tagsRepo.get({
                pk: 'VALORANT',
                sk: `VALORANT#`,
            });
            expect(put).toBe(true);
        });
    });
    // ffmpeg -i 'fb386d57-22dc-48d7-85bf-d2d95d688f4b.mp4' -acodec aac -vcodec libx264 output.mp4
    // '.\fb386d57-22dc-48d7-85bf-d2d95d688f4b (1).mp4'

    // describe('getVideos', () => {
    //     test('returns videos', async () => {
    //         const videos = await dynamoDb.getVideos('valorant');
    //         expect(Array.isArray(videos)).toBeTruthy();
    //     });
    // });
    //
    // describe('hasUsedVideo', () => {
    //     test('returns true when used video', async () => {
    //         await dynamoDb.createVideo('valorant', videoUrl2);
    //         const hasUsed = await dynamoDb.hasUsedVideo(videoUrl2);
    //         expect(hasUsed).toBe(true);
    //     });
    // });
});
