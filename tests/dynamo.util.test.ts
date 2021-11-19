import { ClipsRepository, TagsRepository } from '../src/index';
import { EnvName } from '../src/interfaces';
import { v4 } from 'uuid';
import { getSk } from '../src/utils/dynamoUtils';
import momentTz from 'moment-timezone';

const moment = momentTz;

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
                rating: date,
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
                rating: date,
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
                rating: date,
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
                rating: date,
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
            const put = await clipsRepo.getByCustomDate(
                gameName,
                {
                    ratedAtDate: 'test',
                    usedInVideoAtDate: 'test',
                    aggregatedAtDate: 'test',
                },
            );
            expect(put).toBeTruthy();
            const del = await clipsRepo.delete(
                gameName,
                guid,
            );
            expect(del).toBeTruthy();
        });
    });
    describe('fuck', () => {
        test('creates fuck and returns cukj', async () => {
            console.log('fuck');
            const put = await tagsRepo.put({
                pk: 'VALORANT',
                sk: `$VALORANT#TEST123123`,
            });
            expect(put).toBeTruthy();
        });
    });

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
