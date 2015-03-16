var util = require('./config/grunt/utils.js');
var files = require('./config/files');

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var port = process.env.PORT || 3000;

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            files: ['Gruntfile.js', 'dist/*.js', 'test/**/*.js', 'src/**/*.js', 'config/**/*.js'],
            dist: ["dist/*.js"],
            port: port
        },
        jshint: {
            files: ['<%= meta.files %>', 'package.json', 'bower.json'],
            dist: ['<%= meta.dist %>'],
            options: {
                // options here to override JSHint defaults
                jshintrc: '.jshintrc'
            }
        },
        jsbeautifier: {
            files: '<%= meta.dist %>'
        },
        concat: {
            options: {
                separator: '\n',
                process: function (src) {
                    var APP_VERSION = util.getVersion();
                    return src
                        .replace(/%VERSION%/g, APP_VERSION.version)
                        .replace(/%WEBSITE%/g, APP_VERSION.website)
                        .replace(/%LICENSE%/g, APP_VERSION.license)
                        .replace(/%CONTRIBUTOR%/g, APP_VERSION.contributor)
                        .replace(/%APP_NAME%/g, APP_VERSION.appname)
                        .replace(/%DESCRIPTION%/g, APP_VERSION.description)
                        .replace(/%YEAR%/g, new Date().getFullYear())
                        .replace(/%SUPPORTED_VERSIONS%/g, APP_VERSION.supported_versions.join(", "));
                }
            },
            minify: {
                src: [
                    'src/header.js',
                    'dist/log-ex-unobtrusive.min.js'
                ],
                dest: 'dist/log-ex-unobtrusive.min.js'
            },
            dist: {
                src: [
                    'src/header.js',
                    'src/module.prefix',
                    'src/declarations.js',
                    // <--------- additional functionality start
                    'src/addins/defaults.js',
                    'src/addins/helpers.js',
                    'src/addins/color.js',
                    'src/addins/supplant.js',
                    'src/addins/masking.js',
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
            '1.0.x': {
                options: {
                    files: files.getAngularFiles('1.0').concat(files.libs, files.tests('1.0'))
                },
                configFile: 'config/karma.conf.js'
            },
            '1.1.x': {
                options: {
                    files: files.getAngularFiles('1.1').concat(files.libs, files.tests('1.1'))
                },
                configFile: 'config/karma.conf.js'
            },
            '1.1.2': {
                options: {
                    files: files.getAngularFiles('1.1.2').concat(files.libs, files.tests('1.1.2'))
                },
                configFile: 'config/karma.conf.js'
            },
            '1.2.x': {
                options: {
                    files: files.getAngularFiles('1.2').concat(files.libs, files.tests('1.2'))
                },
                configFile: 'config/karma.conf.js'
            },
            '1.3.x': {
                options: {
                    files: files.getAngularFiles('1.3').concat(files.libs, files.tests('1.3'))
                },
                configFile: 'config/karma.conf.js'
            },
            latest: {
                options: {
                    files: files.getAngularFiles().concat(files.libs, files.tests('latest'))
                },
                configFile: 'config/karma.conf.js'
            },
            performance: {
                options: {
                    files: files.getAngularFiles().concat(files.libs, ['test/perf/*.js'])
                },
                configFile: 'config/karma.conf.js'
            },
            coverage: {
                configFile: 'config/karma.lcov.conf.js'
            }
        },
        watch: {
            files: '<%= meta.files %>',
            tasks: ['test'],
            options: {
                spawn: false
            }
        },
        coveralls: {
            options: {
                coverage_dir: 'lcov'
            }
        },
        bump: {
            options: {
                filepaths: ['package.json', 'bower.json'],
                syncVersions: true,
                commit: false,
                commitMessage: 'Bumping version to {%= version %}.',
                tag: false,
                tagName: 'v{%= version %}',
                tagMessage: 'Version {%= version %}',
                tagPrerelease: false
            }
        },
        shell: {
            changelog: {
                command: 'git changelog --tag <%= APP_VERSION.version %>'
            }
        },
        clean: {
            dist: ['dist/'],
            cover: ['coverage/']
        },
        minified: {
            files: {
                src: [
                    'dist/log-ex-unobtrusive.js'
                ],
                dest: 'dist/'
            },
            options: {
                sourcemap: true,
                allinone: false,
                ext: '.min.js'
            }
        },
        express: {
            options: {
                port: port
            },
            dev: {
                options: {
                    script: 'sample_app/server.js',
                    debug: false
                }
            }
        },
        open: {
            server: {
                path: 'http://localhost:<%= meta.port %>'
            }
        },
        copy: {
            files: {
                src: 'dist/*',
                dest: 'sample_app/app/'
            }
        },
        tagrelease: {
            version: util.getVersion().version,
            commit: true,
            prefix: '',
            annotate: false
        }
    });

    grunt.registerTask('test', [
        'clean:cover',
        'jshint:files',
        'karma:1.0.x', 'karma:1.1.x', 'karma:1.2.x',  'karma:1.3.x', , 'karma:1.1.2', 'karma:performance', 'karma:latest'
    ]);
    grunt.registerTask('minify', ['minified' , 'concat:minify']);
    grunt.registerTask('dist', ['clean:dist', 'test', 'concat:dist', 'jsbeautifier', 'minify', 'jshint:dist']);
    grunt.registerTask('dev-release', ['bump:pr:git', 'dist', 'tagrelease']);
    grunt.registerTask('release', ['bump:patch', 'dist', 'tagrelease']);
    grunt.registerTask('changelog', ['shell:changelog']);
    grunt.registerTask('serve', ['copy:files', 'express:dev', 'open', 'watch']);
    grunt.registerTask('default', ['test', 'karma:coverage', 'coveralls']);
};
