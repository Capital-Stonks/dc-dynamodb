console.log('RUNNING INTEGRATION TESTS');

const config = require('./jest.config');

config.testRegex = '/tests/.*(.integration|.e2e).test.(ts)$';
module.exports = config;
