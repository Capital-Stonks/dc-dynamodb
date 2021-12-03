"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenTags = void 0;
const grabGenreTags = (genres, tags) => {
    if (!genres) {
        return [];
    }
    return genres.reduce((acc, genre) => {
        return [...acc, ...tags.genre[genre]];
    }, []);
};
const grabGameTags = (tags, gameName) => {
    if (!tags.game[gameName]) {
        return [];
    }
    return tags.game[gameName];
};
const flattenTags = (tags, gameName, genres) => {
    return [
        ...tags.global,
        ...grabGameTags(tags, gameName),
        ...grabGenreTags(genres, tags),
    ];
};
exports.flattenTags = flattenTags;
//# sourceMappingURL=flattenTagsUtil.js.map