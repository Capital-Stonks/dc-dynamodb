"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionallyCreateDevTables = void 0;
const clipsRepository_1 = require("./src/repositories/clipsRepository");
const schema_1 = require("./src/schema");
const DEV_ENV = 'development';
const conditionallyCreateDevTables = async () => {
    const clipsRepo = new clipsRepository_1.ClipsRepository();
    const db = clipsRepo.client;
    const { TableNames: createdTables } = await db.listTables().promise();
    if (Object.keys(createdTables).length === 0) {
        const create = await Promise.allSettled([
            db.createTable((0, schema_1.clipsTableSchema)(DEV_ENV)),
            db.createTable((0, schema_1.tagsTableSchema)(DEV_ENV)),
        ]);
    }
};
exports.conditionallyCreateDevTables = conditionallyCreateDevTables;
//# sourceMappingURL=createTables.js.map