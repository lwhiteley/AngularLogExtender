var util = require('./config/grunt/utils.js');

module.exports = function (grunt) {

    var APP_VERSION = util.getVersion();

    grunt.initConfig({
        APP_VERSION:APP_VERSION,
        pkg: grunt.file.readJSON('package.json'),
        meta : {
            files : ['Gruntfile.js', 'dist/*.js', 'test/**/*.js', 'src/**/*.js', 'config/**/*.js'],
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
                process: function(src){
                    return src
                        .replace(/%VERSION%/g, APP_VERSION.full)
                        .replace(/%WEBSITE%/g, APP_VERSION.website)
                        .replace(/%LICENSE%/g, APP_VERSION.license)
                        .replace(/%CONTRIBUTOR%/g, APP_VERSION.contributor)
                        .replace(/%APP_NAME%/g, APP_VERSION.appname)
                        .replace(/%DESCRIPTION%/g, APP_VERSION.description);
                }
            },
            dist: {
                src: [
                    'src/header.js',
                    'src/module.prefix',
                    'src/declarations.js',
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
                    
                    // < ----------------
                    'src/module.suffix',
                    // <--------- provider func start
                    'src/providerFunc/main.js',
                    'src/providerFunc/provider.suffix'
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
//        bump: {
//            options: {
//                files: ['package.json'],
//                commit: false,
//                createTag: false,
//                push: false
//            }
//        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: [],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['-a'], // '-a' for all files
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin master',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
            }
        },
        shell: {
            changelog: {
                command: 'git changelog --tag <%= APP_VERSION.full %>'
            }
        }
    });

    grunt.registerTask('bower_update', 'Update bower version', function (arg1) {
        if(arguments.length === 0) {
            util.updateBowerVersion(APP_VERSION.full);
        }
        else {
            util.updateBowerVersion(arg1);
        }
    });
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma-coveralls');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.registerTask('test', ['jshint', 'karma:unit']);
    grunt.registerTask('dist', ['concat', 'jsbeautifier', 'bower_update']);
    grunt.registerTask('fixes', ['bump:patch', 'dist']);
    grunt.registerTask('changelog', ['shell:changelog']);
    grunt.registerTask('default', ['jshint', 'karma:coverage', 'coveralls']);
};