import { ClipsRepository } from './src/repositories/clipsRepository';
import { clipsTableSchema, tagsTableSchema } from './src/schema';

const DEV_ENV = 'development';

export const conditionallyCreateDevTables = async () => {
    const clipsRepo = new ClipsRepository();
    const db = clipsRepo.client;
    const { TableNames: createdTables } = await db.listTables().promise();
    if (Object.keys(createdTables).length === 0) {
        const create = await Promise.allSettled([
            db.createTable(clipsTableSchema(DEV_ENV)),
            db.createTable(tagsTableSchema(DEV_ENV)),
        ]);
    }
};
