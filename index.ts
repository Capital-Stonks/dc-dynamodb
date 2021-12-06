import { ClipsRepository } from './src/repositories/clipsRepository';
import { TagsRepository } from './src/repositories/tagsRepository';

export * from './src/repositories/tagsRepository';
export * from './src/repositories/clipsRepository';
export * from './src/utils/clipsDataStoreUtils';
export * from './src/utils/dateUtils';

export const clipsRepo = new ClipsRepository();
export const tagsRepo = new TagsRepository();

export * from './src/interfaces';
export * from './src/utils/clipEntityUtils';
export * from './src/utils/s3PathUtils';
export * from './src/utils/flattenTagsUtil';
export * from './createTables';
