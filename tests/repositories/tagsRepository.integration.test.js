"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../index");
describe('TagsRepository', () => {
    describe('get', () => {
        test('returns tags interface', async () => {
            const tags = await index_1.tagsRepo.get();
            expect(tags).toBeTruthy();
        });
    });
});
//# sourceMappingURL=tagsRepository.integration.test.js.map