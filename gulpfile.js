const gulp = require("gulp");
var run = require("gulp-run");
var rimraf = require('gulp-rimraf');

gulp.task('clean', function (cb) {
    return gulp.src('./dist', { read: false })
        .pipe(rimraf({ force: true }));
});

gulp.task('copy-files', function () {
    return gulp.src('./install/*.*')
        .pipe(gulp.dest('./bin/lib'));
});

gulp.task('copy-package-lock-json', function () {
    return gulp.src('./package-lock.json')
        .pipe(gulp.dest('./dist'));
});

gulp.task('copy-package-json', function () {
    return gulp.src('./package.json')
        .pipe(gulp.dest('./dist'));
});

gulp.task("build-local-connector", function () {
    return run("npm run build").exec();
});

gulp.task('install-dependencies', function () {
    const targetDirectory = './dist';

    const npmInstallCommand = 'npm ci';

    return run(npmInstallCommand, { cwd: targetDirectory }).exec();
});

gulp.task("package-local-connector", function () {
    return run("npx pkg ./dist --compress Brotli").exec();
});


gulp.task(
    "default",
    gulp.series(
        "clean",
        "copy-package-json",
        "copy-package-lock-json",
        "install-dependencies",
        "build-local-connector",
        "package-local-connector",
        "copy-files"
    )
);
