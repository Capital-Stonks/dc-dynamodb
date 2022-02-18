import { IClip } from '../../src/interfaces';
import * as clipsDataStore from '../../src/utils/clipsDataStoreUtils';
import { v4 } from 'uuid';
import moment from 'moment';
import { clipsRepo } from '../../index';
import * as s3Util from '../../src/utils/s3Utils';
import { getDateNow } from '../../src/utils/dynamoUtils';

const MOCK_FILE_PATH = `${__dirname}/../mocks/mock.mp4`;

jest.setTimeout(100000000);

describe('clipsDataStoreUtils', () => {
    describe('createClip', () => {
        const guid = v4();
        const s3Path = 'integration-test/valorant/create.mp4';

        afterAll(async () => {
            await clipsRepo.delete('valorant', guid);
            await s3Util.deleteObject(s3Path);
        });

        test('creates a clip and uploads file to s3 & returns IClip interface', async () => {
            const clip: IClip = {
                gameName: 'valorant',
                guid,
                s3Path,
                username: 'integration-test',
                source: 'jest',
                sourceTitle: 'Mock Entity',
                sourceDescription: 'Mock Description',
                rating: 7,
                ratedAtDate: getDateNow(),
                usedInVideoAtDate: getDateNow(),
                usedInShortAtDate: getDateNow(),
                aggregatedAtDate: getDateNow(),
                tags: ['flick', 'ace'],
                duration: 100,
                resolutionHeight: 720,
            } as unknown as IClip;
            const response = await clipsDataStore.createClip(
                clip,
                MOCK_FILE_PATH
            );
            expect(response.guid).toBe(clip.guid);

            const createdClip = (await clipsRepo.get('valorant', guid)) as any;

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
            guid: v4(),
            s3Path: 'folder/valorant/update-me',
            username: 'integration-test',
            source: 'jest',
            sourceTitle: 'Mock Entity',
            sourceDescription: 'Mock Description',
            rating: 7,
            ratedAtDate: getDateNow(),
            usedInVideoAtDate: getDateNow(),
            usedInShortAtDate: getDateNow(),
            aggregatedAtDate: getDateNow(),
            tags: ['flick', 'ace'],
            duration: 100,
            resolutionHeight: 720,
        } as unknown as IClip;

        beforeAll(async () => {
            await clipsDataStore.createClip(clip, MOCK_FILE_PATH);
        });

        afterAll(async () => {
            await clipsRepo.delete('valorant', clip.guid);
            await s3Util.deleteObject('folder/valorant/ive-been-updated');
        });

        test('updates dynamo entity and uploads a new file to s3 and deletes old s3 file', async () => {
            const update = {
                ...clip,
                s3Path: 'folder/valorant/ive-been-updated',
                rating: 9,
            };

            const updatedClip = await clipsDataStore.updateClip(
                update,
                MOCK_FILE_PATH,
                clip.s3Path
            );

            expect(updatedClip.guid).toBe(clip.guid);

            const fetchedUpdatedClip = (await clipsRepo.get(
                'valorant',
                clip.guid
            )) as any;

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
            guid: v4(),
            s3Path: 'folder/valorant/move-me!',
            username: 'integration-test',
            source: 'jest',
            sourceTitle: 'Mock Entity',
            sourceDescription: 'Mock Description',
            rating: 7,
            ratedAtDate: getDateNow(),
            usedInVideoAtDate: getDateNow(),
            usedInShortAtDate: getDateNow(),
            aggregatedAtDate: getDateNow(),
            tags: ['flick', 'ace'],
            duration: 100,
            resolutionHeight: 720,
        } as unknown as IClip;

        beforeAll(async () => {
            await clipsDataStore.createClip(clip, MOCK_FILE_PATH);
        });

        afterAll(async () => {
            await clipsRepo.delete('valorant', clip.guid);
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

            const fetchedUpdatedClip = (await clipsRepo.get(
                'valorant',
                clip.guid
            )) as any;

            expect(fetchedUpdatedClip.s3Path).toBe(
                'new-folder/valorant/move-me!'
            );
        });
    });

    describe('deleteClip', () => {
        const clip = {
            gameName: 'valorant',
            guid: v4(),
            s3Path: 'folder/valorant/delete-me',
            username: 'integration-test',
            source: 'jest',
            sourceTitle: 'Mock Entity',
            sourceDescription: 'Mock Description',
            rating: 7,
            ratedAtDate: getDateNow(),
            usedInVideoAtDate: getDateNow(),
            usedInShortAtDate: getDateNow(),
            aggregatedAtDate: getDateNow(),
            tags: ['flick', 'ace'],
            duration: 100,
            resolutionHeight: 720,
        } as unknown as IClip;

        beforeAll(async () => {
            await clipsDataStore.createClip(clip, MOCK_FILE_PATH);
        });

        test('deletes dynamo entity and s3 object', async () => {
            await clipsDataStore.deleteClip(clip);

            const deletedS3Object = await s3Util.getObject(clip.s3Path);
            expect(deletedS3Object).toBe(null);

            const fetchedUpdatedClip = (await clipsRepo.get(
                'valorant',
                clip.guid
            )) as any;
            expect(fetchedUpdatedClip).toBe(null);
        });
    });
});
