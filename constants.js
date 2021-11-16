require('dotenv').config();

const { SERVER_PORT, NODE_ENV, ENVIRONMENT_NAME } = process.env;

const IS_DEVELOPMENT = NODE_ENV === 'development';

module.exports = {
    VALORANT: 'valorant',
    SK_SEPARATOR: '#',
    BUCKET_NAME: IS_DEVELOPMENT ? 'dev-pepega-clips' : 'pepega-clips',
    SOURCE_TWITCH: 'twitch',
    SOURCE_TWITTER: 'twitter',
    NODE_ENV,
    SERVER_PORT,
    IS_DEVELOPMENT,
    ENVIRONMENT_NAME
};
