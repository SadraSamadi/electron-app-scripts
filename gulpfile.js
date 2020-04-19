const {dest, series, src} = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const jest = require('jest');
const del = require('del');

const paths = {
  scripts: 'src/**/*.ts',
  dist: 'dist',
  type: 'type',
  test: 'test',
  tsconfig: 'tsconfig.json'
};

exports.clean = clean;
exports.build = build;
exports.type = type;
exports.test = test;
exports.default = series(clean, build, type);

function clean() {
  return del([paths.dist, paths.type]);
}

function build() {
  return src(paths.scripts)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.dist));
}

function type() {
  let project = typescript.createProject(paths.tsconfig, {
    isolatedModules: false
  });
  return src(paths.scripts)
    .pipe(project())
    .dts
    .pipe(dest(paths.type));
}

function test() {
  return jest.run();
}
