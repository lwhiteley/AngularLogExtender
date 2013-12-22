var util = require('./config/grunt/utils.js');

module.exports = function (grunt) {

    var APP_VERSION = util.getVersion();

    grunt.initConfig({
        APP_VERSION:APP_VERSION,
        pkg: grunt.file.readJSON('package.json'),
        meta : {
            files : ['Gruntfile.js', 'dist/*.js', 'test/unit/*.js', 'src/**/*.js'],
            dist : ["dist/*.js"]
        },
        jshint: {
            files: '<%= meta.files %>',
            options: {
                // options here to override JSHint defaults
                jshintrc: '.jshintrc'
            }
        },
        jsbeautifier : {
            files : '<%= meta.dist %>'
        },
        concat: {
            options: {
                separator: '\n',
                process: function(src, filepath){
                    return src.replace(/%VERSION%/g, APP_VERSION.full);
                }
            },
            dist: {
                src: [
                    'src/header.js',
                    'src/module.prefix',
                    // < ----------------
                    'src/enhanceObj/obj.prefix',
                    'src/enhanceObj/main.js',
                    // <------- eLogger Start
                    'src/eLogger/obj.prefix',
                    'src/eLogger/logger.js',
                    'src/eLogger/globals.js',
                    'src/eLogger/obj.suffix',
                    // <------- eLogger End
                    // <------- extras Start
                    'src/extras/extras.js',
                    // <------- extras End
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
                browsers: ['PhantomJS']
            },
            unit: {
                configFile: 'config/karma.conf.js'
            },
            coverage: {
                configFile : 'config/karma.lcov.conf.js'
            }
        },
        watch: {
            files:  '<%= meta.files %>',
            tasks: ['jshint', 'karma:unit']
        },
        coveralls: {
            options: {
                coverage_dir: 'lcov'
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                commit: false,
                createTag: false,
                push: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma-coveralls');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('test', ['jshint', 'karma:unit']);
    grunt.registerTask('dist', ['concat', 'jsbeautifier']);
    grunt.registerTask('fixes', ['bump:patch', 'dist']);
    grunt.registerTask('default', ['jshint', 'karma:coverage', 'coveralls']);
};