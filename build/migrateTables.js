"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./src/constants");
const clipsRepository_1 = require("./src/repositories/clipsRepository");
const tagsRepository_1 = require("./src/repositories/tagsRepository");
const schema_1 = require("./src/schema");
const tags_1 = require("./src/tags");
// this file is just to run a one time migration to get the tables into aws
const environment = constants_1.DYNAMO_ENV_NAME;
const clipsRepo = new clipsRepository_1.ClipsRepository({
    region: 'us-east-2',
    envName: environment,
});
const db = clipsRepo.client;
const tagsRepo = new tagsRepository_1.TagsRepository({
    region: 'us-east-2',
    envName: environment,
});
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
            db.createTable((0, schema_1.clipsTableSchema)(environment)),
            db.createTable((0, schema_1.tagsTableSchema)(environment)),
        ]).catch((e) => {
            if (e) {
                console.log(JSON.stringify(e));
            }
        });
        console.log(create);
    }
    const put = await tagsRepo.put({ pk: 'GLOBAL', tags: tags_1.tagMap });
    console.log(put);
})();
//# sourceMappingURL=migrateTables.js.map