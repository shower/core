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
                    'node_modules/ym/modules.js',
                    'lib/init.js',
                    'lib/*/*.js',
                    'plugins/*.js'
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
                    port: 0
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
