'use strict';

const gulp = require('gulp');
const eslint = require('gulp-eslint');
const lintspaces = require('gulp-lintspaces');

gulp.task('lint:ec', () => {
    const sources = [
        '!.DS_Store',
        '!{.git,node_modules}/**',
        '!{dist,tests_output}/**',
        '**',
    ];

    const options = {
        editorconfig: '.editorconfig',
        ignores: [
            'js-comments',
            'html-comments',
        ],
    };

    return gulp.src(sources, {dot: true})
        .pipe(lintspaces(options))
        .pipe(lintspaces.reporter());
});

gulp.task('lint:js', () => {
    return gulp.src('lib/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('lint', [
    'lint:ec',
    'lint:js',
]);
