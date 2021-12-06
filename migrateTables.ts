import { DYNAMO_ENV_NAME } from './src/constants';
import { ClipsRepository } from './src/repositories/clipsRepository';
import { TagsRepository } from './src/repositories/tagsRepository';
import { clipsTableSchema, tagsTableSchema } from './src/schema';
import { tagMap } from './src/tags';

// this file is just to run a one time migration to get the tables into aws
const environment = DYNAMO_ENV_NAME;
const clipsRepo = new ClipsRepository();

const db = clipsRepo.client;

const tagsRepo = new TagsRepository();
const CREATE_TABLES = true;
// dont set to true unless you want to delete the tables
const DELETE_TABLES = false;
const YOU_SURE_YOU_WANT_TO_DELETE_TABLES = false;
(async () => {
    if (DELETE_TABLES && YOU_SURE_YOU_WANT_TO_DELETE_TABLES) {
        const del = await Promise.allSettled([
            db.deleteTable({ TableName: clipsRepo.tableName }),
            db.deleteTable({ TableName: tagsRepo.tableName }),
        ]);
        console.log(del);
    }
    if (CREATE_TABLES) {
        const create = await Promise.allSettled([
            db.createTable(clipsTableSchema(environment)),
            db.createTable(tagsTableSchema(environment)),
        ]).catch((e) => {
            if (e) {
                console.log(JSON.stringify(e));
            }
        });
        console.log(create);
    }

    const put = await tagsRepo.put({ pk: 'GLOBAL', tags: tagMap });
    console.log(put);
})();
