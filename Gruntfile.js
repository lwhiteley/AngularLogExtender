module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'dist/*.js', 'test/unit/*.js'],
            options: {
                // options here to override JSHint defaults
                jshintrc: '.jshintrc'
            }
        },
        karma: {
            options: {
                singleRun: true,
                browsers: ['PhantomJS'],
                reporters: 'dots'
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
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.registerTask('test', ['jshint', 'karma:unit']);
    grunt.registerTask('default', ['jshint', 'karma:unit']);

};