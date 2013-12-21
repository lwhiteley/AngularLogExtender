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
        }
    });
};
