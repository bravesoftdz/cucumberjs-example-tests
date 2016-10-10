/* eslint import/no-extraneous-dependencies: [2, { devDependencies: true }] */

import gulp from 'gulp';
import linter from 'gulp-eslint';
import gulpIf from 'gulp-if';
import gutil from 'gulp-util';
import combiner from 'stream-combiner2';
import cucumber from 'gulp-cucumber';

// Has ESLint fixed the file contents?
const isFixed = (file) => file != null && file.eslint != null && file.eslint.fixed;

const lint = (fix) => {
  const combined = combiner.obj([
    gulp.src([
      '**/*.js',
      '!**/*.min.js',
      '!client/**',
      '!dist/**',
      '!static/**',
      '!build/**',
      '!coverage/**',
      '!node_modules/**'
    ]),
    linter({ fix }),
    linter.format(),
    linter.failAfterError(),
    gulpIf(isFixed, gulp.dest('.'))
  ]);
  // combined.on('error', console.error.bind(console));
  return combined;
};

gulp.task('lint', () => lint(false));

gulp.task('cucumber', () => {
  return gulp.src(`features/${gutil.env.feature}*`).pipe(cucumber({
    steps: 'features/step_definitions/*',
    support: 'features/support/*'
  }));
});
