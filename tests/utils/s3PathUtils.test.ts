import * as s3PathUtils from '../../src/utils/s3PathUtils';

describe('s3PathUtils', () => {
    describe('createS3Path', () => {
        test('returns path without parentFolder', () => {
            expect(
                s3PathUtils.createS3Path('some-folder', 'some-game', 'filename')
            ).toBe('some-folder/some-game/filename');
        });

        test('returns path with parentFolder', () => {
            expect(
                s3PathUtils.createS3Path(
                    'some-folder',
                    'some-game',
                    'filename',
                    'parent-folder'
                )
            ).toBe('some-folder/some-game/parent-folder/filename');
        });
    });

    describe('updateS3PathFolder', () => {
        test('updates the folder part of an s3Path', () => {
            const s3Path = 'folder/gameName/filename';
            const result = s3PathUtils.updateS3PathFolder('new-folder', s3Path);
            expect(result).toBe('new-folder/gameName/filename');
        });
    });

    describe('addParentFolder', () => {
        test('adds a parent folder before file name of an s3Path', () => {
            const s3Path = 'folder/gameName/filename';
            const result = s3PathUtils.addParentFolder(
                'some-parent-folder',
                s3Path
            );
            expect(result).toBe('folder/gameName/some-parent-folder/filename');
        });
    });
});
