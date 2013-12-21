// an example karma.conf.js
module.exports = function (config) {
    config.set({
        basePath: '../',
        frameworks: ['jasmine'],
        files: [
            'libs/angular/angular.js',
            'libs/angular/angular-route.js',
            'libs/angular/angular-mocks.js',
            'dist/*.js',
            'test/unit/*.js'
        ],
        autoWatch: true,
        browsers: ['Chrome'],
        junitReporter: {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    });
};
