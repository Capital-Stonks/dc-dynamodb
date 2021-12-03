import { ITags } from '../interfaces';

const grabGenreTags = (genres: string[] | undefined, tags: ITags): string[] => {
    if (!genres) {
        return [];
    }

    return genres.reduce((acc, genre) => {
        return [...acc, ...tags.genre[genre]];
    }, [] as string[]);
};

const grabGameTags = (tags: ITags, gameName: string) => {
    if (!tags.game[gameName]) {
        return [];
    }

    return tags.game[gameName];
};

export const flattenTags = (
    tags: ITags,
    gameName: string,
    genres: string[] | undefined
): string[] => {
    return [
        ...tags.global,
        ...grabGameTags(tags, gameName),
        ...grabGenreTags(genres, tags),
    ];
};
