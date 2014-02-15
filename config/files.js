module.exports = {
    libs: [
        'libs/bower/lodash/dist/lodash.compat.js',
        'libs/datespy/datespy.js',
        'test/helpers/globals.js',
        'src/declarations.js',
        'src/enhanceObj/*.js',
        'src/eLogger/logger.js',
        'src/eLogger/globals.js',
        'src/extras/*.js',
        'src/providerFunc/*.js'
    ],
    exclusions : ['src/enhanceObj/globals.js'],
    reporters : ['dots', 'coverage'],
    tests : function (version) {
        var vspec = [];
        if(/[1-9]\.[2-9]|[1-9]\.[1-9]\.[2-9]|[1-9]\.[2-9]\.[1-9]/.test(version)) {
            vspec =  [
                'test/vspec/*.js'
            ];
        }
        return ['test/unit/*.js'].concat(vspec);
    },
    getAngularFiles: function (version) {
        if (version === undefined) {
            version = 'latest';
        } else {
            version += '.x';
        }
        return [
            'libs/angular/' + version + '/angular.js',
            'libs/angular/' + version + '/angular-mocks.js'
        ];
    }
};