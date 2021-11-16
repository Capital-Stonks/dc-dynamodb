import { ClipsRepository, TagsRepository } from '../src/index';
import { EnvName } from '../src/interfaces';
import { SK_SEPARATOR } from '../constants.js'
import { marshall } from '@aws-sdk/util-dynamodb';

describe('dynamo.util', () => {
    let clipsRepo;
    let tagsRepo;
    beforeAll(async () => {
        const dbConfig = { region: 'us-east-2', envName: EnvName.DEV };
        clipsRepo = new ClipsRepository(dbConfig);
        tagsRepo = new TagsRepository(dbConfig);

    });

    afterAll(async () => {
    });

    describe('createVideo', () => {
        test('creates and returns video', async () => {
            const put = await clipsRepo.putClip({
                gameName: 'VALORANT',
                guid: 'asdfasdfXXXXZXXZZZZZZZTEST123123',
                username: 'jake',
                // source: 'twitter',
                sourceTitle: 'most yoked ace',
                sourceDescription: 'so chad omg',
                tags: ['wow', 'ace'],
                duration: 190,
                resolutionHeight: 69,
                // rating: new Date().toString(),
                ratedAtDate: new Date().toString(),
                usedInVideoAtDate: new Date().toString(),
                aggregatedAtDate: new Date().toString(),
            });
            expect(put).toBeTruthy();
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
