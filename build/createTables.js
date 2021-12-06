"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionallyCreateDevTables = void 0;
const clipsRepository_1 = require("./src/repositories/clipsRepository");
const schema_1 = require("./src/schema");
const DEV_ENV = 'development';
const conditionallyCreateDevTables = async () => {
    const clipsRepo = new clipsRepository_1.ClipsRepository();
    const db = clipsRepo.client;
    const created = await Promise.allSettled([
        db.createTable((0, schema_1.clipsTableSchema)(DEV_ENV)),
        db.createTable((0, schema_1.tagsTableSchema)(DEV_ENV)),
    ]).catch(() => { });
    console.log(created);
};
exports.conditionallyCreateDevTables = conditionallyCreateDevTables;
//# sourceMappingURL=createTables.js.map