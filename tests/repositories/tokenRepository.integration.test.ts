import { tokensRepo } from '../../index';
const ORIG_ENV = { ...process.env };
process.env.NODE_ENV = 'development';

afterAll(async () => {
    process.env = { ...ORIG_ENV };
});
describe('tokensRepo', () => {
    describe('create', () => {
        test('returns tokensRepo interface', async () => {
            const tags = await tokensRepo.create(
                'test',
                'testToken',
                'today',
                'tt'
            );
            expect(tags).toBeTruthy();
        });
    });
});
