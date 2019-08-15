
const path = require('path')

module.exports = {
    rootDir: path.resolve(__dirname, '../../'),
    moduleFileExtensions: [
      "js"
    ],
    // testResultsProcessor: "jest-report",
    // setupTestFrameworkScriptFile: "<rootDir>/tests/jasmine.js",
    testMatch: [
      "**/?(*.)(spec|test|e2e).js?(x)"
    ],
    coveragePathIgnorePatterns: ['/node_modules/', '/test/'],
    testURL: 'http://localhost'
}