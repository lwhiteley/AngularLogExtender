var files = require('./files');

module.exports = function (config) {
	config.set({
		basePath: '../',
		frameworks: ['jasmine'],
		exclude: files.exclusions,
		autoWatch: true,
		browsers: ['Chrome'],
		junitReporter: {
			outputFile: 'test_out/unit.xml',
			suite: 'unit'
		},
		reporters: files.reporters,
		preprocessors: {
			// source files, that you wanna generate coverage for
			// do not include tests or libraries
			// (these files will be instrumented by Istanbul)
			'src/**/*.js': ['coverage']
		},
		coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		}
	});
};
