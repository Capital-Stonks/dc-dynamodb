import { tagsRepo } from '../../index';

describe('TagsRepository', () => {
    describe('get', () => {
        test('returns tags interface', async () => {
            const tags = await tagsRepo.get();
            expect(tags).toBeTruthy();
        });
    });
});
