var testConfig = require('./testConfig')();
var testRunner = require('./testRunner');
var testReporter = require('./reporters/nodeTestReporter');
var testSuiteGenerator = require('./testSuiteGenerator');
var CSVFormatter = require('./formatter/CSVFormatter');

var compose = function(f, g) {
    return function(v) {
        return f(g(v));
    };
};

var curry = function(fn, arg) {
    return fn.bind(null, arg);
};

var models = testConfig.models;
var formats = testConfig.formats;
var tests = testConfig.get;
var suite = testConfig.suite;

suite.tests = testSuiteGenerator({
    models: {
        'model': models.modelWithSource
    },
    formats: ['PathMap', 'JSON']
});

var env = 'node ' + process.version;
var resultsReporter = compose(testReporter.resultsReporter, CSVFormatter.toTable);
var benchmarkReporter = compose(testReporter.benchmarkReporter, curry(CSVFormatter.toRow, env));

testRunner(suite, env, benchmarkReporter, resultsReporter);
