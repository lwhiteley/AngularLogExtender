module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'dist/*.js', 'test/unit/*.js', 'src/**/*.js'],
            options: {
                // options here to override JSHint defaults
                jshintrc: '.jshintrc'
            }
        },
        jsbeautifier : {
            files : ["dist/*.js"]
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: [
                    'src/header.js',
                    'src/module.prefix',
                    // < ----------------
                    'src/enhanceObj/obj.prefix',
                    'src/enhanceObj/main.js',
                    // <------- eLogger
                    'src/eLogger/obj.prefix',
                    'src/eLogger/logger.js',
                    'src/eLogger/globals.js',
                    'src/eLogger/obj.suffix',
                    // <------- eLogger
                    // <------- extras
                    'src/extras/extras.js',
                    // <------- extras
                    'src/enhanceObj/globals.js',
                    'src/enhanceObj/obj.suffix',
                    // < ----------------
                    'src/module.suffix'
                ],
                dest: 'dist/log-ex-unobtrusive.js'
            }
        },
        karma: {
            options: {
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters: ['dots', 'coverage'],
                preprocessors: {
                    // source files, that you wanna generate coverage for
                    // do not include tests or libraries
                    // (these files will be instrumented by Istanbul)
                    'src/**/*.js': ['coverage']
                },
                // optionally, configure the reporter
                coverageReporter: {
                    type : 'html',
                    dir : 'coverage/'
                }
            },
            unit: {
                configFile: 'config/karma.conf.js'
            }
        },
        watch: {
            files:  ['Gruntfile.js', 'dist/*.js', 'test/unit/*.js'],
            tasks: ['jshint', 'karma:unit']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('test', ['jshint', 'karma:unit']);
    grunt.registerTask('dist', ['concat', 'jsbeautifier']);
    grunt.registerTask('default', ['jshint', 'karma:unit']);
};