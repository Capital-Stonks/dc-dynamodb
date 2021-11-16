import { ClipsRepository } from './src';
import { EnvName } from './src/interfaces';
import { clipsTableSchema, tagsTableSchema } from './src/schema';

// this file is just to run a one time migration to get the tables into aws

const db = new ClipsRepository({ region: 'us-east-2', envName: EnvName.DEV }).client;

(async () => {
    const results = await Promise.allSettled([
        db.createTable(clipsTableSchema(EnvName.DEV)),
        db.createTable(tagsTableSchema(EnvName.DEV)),
    ]).catch((e) => {
        if (e){
            console.log(JSON.stringify(e));
        }
    });
    console.log(results);
})();
