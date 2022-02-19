import { tokensRepo } from '../../index';

const ORIG_ENV = { ...process.env };
process.env.NODE_ENV = 'development';

afterAll(async () => {
    process.env = { ...ORIG_ENV };
});

describe('tokensRepo', () => {
    describe('create', () => {
        test('create token is truthy', async () => {
            const res = await tokensRepo.put({
                csrfState: 'teststateguid',
                accessToken: 'testToken',
                refreshToken: 'today',
                expirationDate: 'tt',
                source: 'thetok',
            });
            expect(res).toBeTruthy();
        });
    });

    describe('get', () => {
        test('get token is truthy', async () => {
            const res = await tokensRepo.get('teststateguid');
            expect(res).toBeTruthy();
        });
    });

    describe('delete', () => {
        test('delete token is truthy', async () => {
            const res = await tokensRepo.delete('teststateguid');
            expect(res).toBeTruthy();
        });
    });
});
