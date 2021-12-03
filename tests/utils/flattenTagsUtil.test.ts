import { flattenTags } from '../../src/utils/flattenTagsUtil';

describe('flattenTagsUtil', () => {
    describe('flattenTags', () => {
        test('returns flattened array of tags for gameName and genre', () => {
            const mockTags = {
                global: ['funny', 'fail'],
                genre: {
                    shooter: ['headshot'],
                },
                game: {
                    valorant: ['char.raze'],
                },
            };
            const flattenedTags = flattenTags(mockTags, 'valorant', [
                'shooter',
            ]);
            expect(flattenedTags.sort()).toMatchObject(
                ['char.raze', 'funny', 'fail', 'headshot'].sort()
            );
        });
    });
});
