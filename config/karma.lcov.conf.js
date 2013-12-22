// an example karma.conf.js
module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'libs/angular/angular.js',
            'libs/angular/angular-mocks.js',
            'test/helpers/globals.js',
            'src/enhanceObj/*.js',
            'src/eLogger/*.js',
            'src/extras/*.js',
            'test/unit/*.js'
        ],
        exclude : ['src/**/globals.js'],
        autoWatch: true,
        browsers: ['Chrome'],
        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        },
        reporters: ['dots', 'coverage'],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/*.js': ['coverage']
        },
        coverageReporter : {
            type : 'lcov',
            dir : 'lcov/'
        }
    });
};