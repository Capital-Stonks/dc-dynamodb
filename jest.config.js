module.exports = {
    preset: 'ts-jest',
    roots: ['<rootDir>/src', '<rootDir>/tests'],
    testRegex: '/tests/((?!\\.integration|e2e).)*\\.test.(ts|js)$',
    moduleFileExtensions: ['js', 'ts', 'tsx', 'json', 'node'],
    coveragePathIgnorePatterns: ['(tests/.*.mock).(ts)$', 'src/api'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    setupFilesAfterEnv: ['<rootDir>/tests/setup-tests.js'],
    clearMocks: true,
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    verbose: true,
};
