import { IClip } from '../../src/interfaces';
import { ClipsRepository } from '../../src/repositories/clipsRepository';
import { clipFactory } from '../factory';
import { IClip } from '../../src/interfaces';

describe('clipsRepository', () => {
    const clip1 = clipFactory({
        s3Path: 'folder1/valorant/file1',
        usedInShortAtDate: undefined,
    }) as IClip;
    const clip2 = clipFactory({
        s3Path: 'folder2/valorant/file2',
        usedInShortAtDate: undefined,
    }) as IClip;
    const clip3 = clipFactory({ s3Path: 'folder3/valorant/file3' }) as IClip;
    const clipRepo = new ClipsRepository();

    beforeAll(async () => {
        await clipRepo.create(clip1 as Clip);
        await clipRepo.create(clip2 as IClip);
        await clipRepo.create(clip3 as IClip);
    });

    afterAll(async () => {
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
            expect(usedInShort.length).toBe(1);
            expect(usedInShort[0].guid).toBe(clip3.guid);
        });
    });

    describe('getByS3Path', () => {
        test('returns entities by s3 path', async () => {
            const entity = await clipRepo.getByS3Path('valorant', clip1.s3Path);
            expect(entity.guid).toBe(clip1.guid);
        });
    });
});
