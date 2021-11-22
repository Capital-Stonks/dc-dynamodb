import { ClipsRepository } from '../../src/repositories/clipsRepository';
import { clipFactory } from '../factory';

describe('clipsRepository', () => {
    const clip1 = clipFactory({ s3Path: 'folder1/valorant/file1' });
    const clip2 = clipFactory({ s3Path: 'folder2/valorant/file2' });
    const clip3 = clipFactory({ s3Path: 'folder3/valorant/file3' });
    const clipRepo = new ClipsRepository();

    describe('getByFolder', () => {
        beforeAll(async () => {
            await clipRepo.create(clip1);
            await clipRepo.create(clip2);
            await clipRepo.create(clip3);
        });

        afterAll(async () => {
            await clipRepo.delete(clip1.gameName, clip1.guid);
            await clipRepo.delete(clip2.gameName, clip2.guid);
            await clipRepo.delete(clip3.gameName, clip3.guid);
        });

        test('returns items by folder & gameName', async () => {
            const clips = await clipRepo.getByFolder('folder1', 'valorant');
            expect(clips.length).toBe(1);
            expect(clips[0].guid).toBe(clip1.guid);
        });
    });
});
