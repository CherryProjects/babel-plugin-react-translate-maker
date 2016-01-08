import gulp from 'gulp';
import mocha from 'gulp-mocha';
import babel from 'gulp-babel';
import path from 'path';

const babelConfig = {
  stage: 0,
};

gulp.task('test', () => {
  return gulp.src('./tests/**/*.js')
    .pipe(babelConfig)
    .pipe(mocha({
      timeout: 20000,
    }));
});

gulp.task('coveralls', ['test'], () => {
  if (!process.env.CI) {
    return void 0;
  }

  return gulp.src(path.join(__dirname, 'coverage/lcov.info'))
    .pipe(coveralls());
});

gulp.task('build', () => {
  return gulp.src('./src/**/*.{js,jsx}')
    .pipe(babel(babelConfig))
    .pipe(gulp.dest('./dist'));
});

gulp.doneCallback = (err) => {
  process.exit(err ? 1 : 0);
};
