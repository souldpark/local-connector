import gulp from "gulp";
import run from "gulp-run";
import rimraf from 'gulp-rimraf';
import zip from 'gulp-zip';
import release from 'gulp-github-release';
import jeditor from "gulp-json-editor";
import bump from 'gulp-update-version';
import fs from "fs";
import { createHash } from "crypto";

var getPackageJson = function () {
    return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

gulp.task('clean', function (cb) {
    if (fs.existsSync('./dist')) {
        return gulp.src('./dist', { read: false })
            .pipe(rimraf({ force: true }))
            .on('end', cb);
    } else {
        cb();
    }
});

gulp.task('bump', function (done) {
    gulp.src("./package.json")
        .pipe(bump())
        .pipe(gulp.dest('./'))
        .on('end', done);
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

gulp.task("copy-service-installer", function () {
    return gulp.src('./winservice.js')
        .pipe(gulp.dest('./dist'));
});


gulp.task('zip', function () {
    return gulp.src('./dist/**')
        .pipe(zip('local-connector.zip'))
        .pipe(gulp.dest('./distribution'));
});

gulp.task('bump', function (done) {
    gulp.src("./package.json")
        .pipe(bump())
        .pipe(gulp.dest('./'))
        .on('end', function () {
            var pkg = getPackageJson();

            const buff = fs.readFileSync("./distribution/local-connector.zip");

            const hash = createHash("sha256").update(buff).digest("hex");

            gulp.src("./local-connector.json")
                .pipe(jeditor({
                    'version': pkg.version,
                    "architecture": {
                        "64bit": {
                            "url": `https://github.com/souldpark/local-connector/releases/download/${pkg.version}/local-connector.zip`,
                            "hash": hash
                        }
                    }
                }))
                .pipe(gulp.dest("./"))
                .on('end', done);
        });
});

gulp.task('release', function (done) {
    var pkg = getPackageJson();

    gulp.src('./distribution/local-connector.zip')
        .pipe(release({
            token: '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',                     // or you can set an env var called GITHUB_TOKEN instead
            owner: 'souldpark',                    // if missing, it will be extracted from manifest (the repository.url field)
            repo: 'local-connector',            // if missing, it will be extracted from manifest (the repository.url field)
            tag: pkg.version,                      // if missing, the version will be extracted from manifest and prepended by a 'v'
            name: `Release ${pkg.version}`,     // if missing, it will be the same as the tag
            notes: 'New release',                // if missing it will be left undefined
            draft: false,                       // if missing it's false
            prerelease: false                  // if missing it's false
        }))
        .on('end', done);
});

gulp.task(
    "default",
    gulp.series(
        "clean",
        "bump",
        "copy-package-json",
        "copy-package-lock-json",
        "build-local-connector",
        "copy-service-installer",
        "zip",
        "release"
    )
);
