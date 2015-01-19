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
            basic: {
                src: [
                    // Module system.
                    'node_modules/ym/modules.js',

                    // Plugins.
                    'node_modules/shower-timer/shower-timer.js',
                    'node_modules/shower-next/shower-next.js',
                    'node_modules/shower-progress/shower-progress.js',
                    'node_modules/shower-touch/shower-touch.js',
                    'node_modules/shower-notes/shower-notes.js',

                    // Core.
                    'lib/init.js',
                    'lib/*/*.js'
                ],
                dest: 'shower.js'
            },
            tests: {
                src: ['tests/unit/test.*.js'],
                dest: 'tests/unit/tests.js'
            }
        },
        mocha: {
            all: ['tests/unit/*.html']
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
        casperjs: {
            files: ['tests/functional/*.js']
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
        'concat:basic',
        'uglify'
    ]);

    grunt.registerTask('dev', [
        'jscs',
        'concat:basic'
    ]);

    grunt.registerTask('test', [
        'test:unit',
        'test:func'
    ]);

    grunt.registerTask('test:func', [
        'jscs',
        'concat:basic',
        'uglify',
        'casperjs'
    ]);

    grunt.registerTask('test:unit', [
        'jscs',
        'concat',
        'uglify',
        'mocha'
    ]);
};
