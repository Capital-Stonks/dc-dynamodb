import moment from 'moment';
import { v4 } from 'uuid';

export const clipFactory = (args = {}) => ({
    gameName: 'valorant',
    guid: v4(),
    s3Path: `some-folder/valorant/${v4()}.mp4`,
    username: 'integration-test',
    shortsTitle: 'some-title',
    highlightsText: 'ding',
    source: 'jest',
    sourceTitle: 'Mock Entity',
    sourceDescription: 'Mock Description',
    rating: 7,
    ratedAtDate: moment()
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    usedInVideoAtDate: moment()
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    usedInShortAtDate: moment()
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    aggregatedAtDate: moment()
        .tz('America/New_York')
        .format('YYYY-MM-DD HH:mm:ss.SSS'),
    tags: ['flick', 'ace'],
    duration: 100,
    resolutionHeight: 720,
    ...args,
});
