module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                mangle: true,
                banner: '/**\n * <%= pkg.description %>\n * <%= pkg.name %> v<%= pkg.version %>, <%= pkg.homepage %>\n * @copyright 2010–<%= grunt.template.today("yyyy") %> Vadim Makeev, http://pepelsbey.net\n * @license MIT license: github.com/shower/shower/wiki/MIT-License\n */\n'
            },
            build: {
                src: ['lib/*/*.js','plugins/*.js'],
                dest: 'shower.min.js'
            }
        },
        concat: {
            dist: {
                src: ['lib/*/*.js','plugins/*.js'],
                dest: 'shower.js'
            }
        },
        connect: {
            ribbon: {
                options: { port: 7497 }
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
        },
        jscs: {
            src: "lib/*/*.js",
            options: {
                config: ".jscs.json"
            }
        }
    });
    grunt.registerTask('default', ['jscs', 'uglify']);
    grunt.registerTask('dev', ['jscs', 'concat']);
    grunt.registerTask('test', ['connect', 'casperjs']);
};