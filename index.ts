import { AWS_REGION, DYNAMO_ENV_NAME } from './src/constants';
import { ClipsRepository } from './src/repositories/clipsRepository';
import { TagsRepository } from './src/repositories/tagsRepository';

export * from './src/repositories/tagsRepository';
export * from './src/repositories/clipsRepository';
export * from './src/utils/clipsDataStoreUtils';
export * from './src/utils/dateUtils';

export const clipsRepo = new ClipsRepository({
    region: AWS_REGION,
    envName: DYNAMO_ENV_NAME,
});
export const tagsRepo = new TagsRepository({
    region: AWS_REGION,
    envName: DYNAMO_ENV_NAME,
});

export * from './src/interfaces';
export * from './src/utils/clipEntityUtils';
