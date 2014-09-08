module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jscs: {
            src: 'lib/*/*.js',
            options: {
                config: '.jscs.json'
            }
        },
        concat: {
            dist: {
                src: [
                    // Module system.
                    'node_modules/ym/modules.js',

                    // Plugins.
                    'node_modules/shower-timer/plugin.Timer.js',
                    'node_modules/shower-navigation/plugin.Navigation.js',
                    'node_modules/shower-progress/plugin.Progress.js',
                    'node_modules/shower-touch/plugin.Touch.js',
                    'node_modules/shower-notes/plugin.Notes.js',

                    // Core.
                    'lib/init.js',
                    'lib/*/*.js'
                ],
                dest: 'shower.js'
            }
        },
        uglify: {
            options: {
                mangle: true,
                banner: '/**\n * <%= pkg.description %>\n * <%= pkg.name %> v<%= pkg.version %>, <%= pkg.homepage %>\n * @copyright 2010–<%= grunt.template.today("yyyy") %> Vadim Makeev, http://pepelsbey.net\n * @license MIT license: github.com/shower/shower/wiki/MIT-License\n */\n'
            },
            build: {
                src: 'shower.js',
                dest: 'shower.min.js'
            }
        },
        connect: {
            task: {
                options: {
                    base: ['.', 'tests'],
                    port: 7497
                }
            }
        },
        casperjs: {
            files: ['tests/*.js']
        },
        bump: {
            options: {
                files: ['package.json', 'bower.json'],
                commitFiles: ['package.json', 'bower.json'],
                pushTo: 'origin'
            }
        }
    });

    grunt.registerTask('default', [
        'jscs',
        'concat',
        'uglify'
    ]);

    grunt.registerTask('dev', [
        'jscs',
        'concat'
    ]);

    grunt.registerTask('test', [
        'jscs',
        'concat',
        'uglify',
        'connect',
        'casperjs'
    ]);

};
