import * as dynamoDb from '../index';
const videoUrl = 'https://www.test.com';
const videoUrl2 = 'https://www.test-2.com';

describe('dynamo.util', () => {
    beforeAll(async () => {
        await dynamoDb.createTables();
    });

    afterAll(async () => {
        await dynamoDb.deleteVideo(videoUrl);
        await dynamoDb.deleteVideo(videoUrl2);
    });

    describe('createTables', () => {
        test('creates defined tables', async () => {
            const result = await dynamoDb.createTables();
            expect(result).toBeTruthy();
        });
    });

    describe('createVideo', () => {
        test('creates and returns video', async () => {
            const video = await dynamoDb.createVideo('valorant', videoUrl);
            expect(video.$response.httpResponse.statusCode).toBe(200);
        });
    });

    describe('getVideos', () => {
        test('returns videos', async () => {
            const videos = await dynamoDb.getVideos('valorant');
            expect(Array.isArray(videos)).toBeTruthy();
        });
    });

    describe('hasUsedVideo', () => {
        test('returns true when used video', async () => {
            await dynamoDb.createVideo('valorant', videoUrl2);
            const hasUsed = await dynamoDb.hasUsedVideo(videoUrl2);
            expect(hasUsed).toBe(true);
        });
    });
});
