var gulp = require('gulp'),
    gulpsmith = require('gulpsmith'),
    markdown   = require('metalsmith-markdown'),
    collections = require('metalsmith-collections'),
    permalinks  = require('metalsmith-permalinks'),
    branch  = require('metalsmith-branch'),
    layouts  = require('metalsmith-layouts'),
    blc = require('metalsmith-broken-link-checker'),
    rimraf = require('gulp-rimraf'),
    ignore = require('gulp-ignore'),
    gulp_front_matter = require('gulp-front-matter'),
    assign = require('lodash.assign'),
    webserver = require('gulp-webserver'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    prefix = require('gulp-autoprefixer');
    

gulp.task('clean', function() {
    return gulp.src(['./build/*'])
        .pipe(rimraf());
});

gulp.task('build.static', function() {
    return gulp.src("./src/**/*.md")
        .pipe(gulp_front_matter()).on("data", function(file) {
            assign(file, file.frontMatter); 
            delete file.frontMatter;
        })
        .pipe(
            gulpsmith()
            .use(fileName())
            .use(collections({
                pages: {
                    pattern: 'content/pages/*.md'
                },
                posts: {
                    pattern: 'content/posts/**/*.md',
                    sortBy: 'date',
                    reverse: true,
                    limit: 25
                },
                tags: {

                },
                lastPosts: {
                    pattern: 'content/posts/**/*.md',
                    sortBy: 'date',
                    reverse: true,
                    limit: 5
                }
            }))
            .use(markdown())
            .use(branch('content/pages/**')
                .use(permalinks({
                    pattern: ':slug'
                }))
            )
            .use(branch('content/posts/**')
                .use(permalinks({
                    pattern: 'blog/:date/:slug',
                    date: 'YYYY/MM'
                }))
            )
            .use(layouts({
                engine: 'swig',
                directory: 'src/templates'
            }))
            .use(blc({
                warn: true
            }))
        )
        .pipe(gulp.dest("./build"));
});

gulp.task('build.css', function () {
    return gulp.src('./src/scss/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(prefix("last 2 versions"))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./build/css'));
});

gulp.task('watch:css', function () {
    return gulp.watch('./src/scss/**/*.scss', ['build.css']);
});

gulp.task('watch:content', function () {
    return gulp.watch('./src/content/**/*.md', ['build.static']);
});

gulp.task('watch:templates', function () {
    return gulp.watch('./src/templates/*.html', ['build.static']);
});

gulp.task('copy:assets', function() {
   return gulp.src('./src/assets/**/*').pipe(gulp.dest('./build/'));
});

gulp.task('watch', ['watch:css', 'watch:content', 'watch:templates']);
gulp.task('build', ['build.static', 'build.css', 'copy:assets']);
gulp.task('serve', ['build', 'watch'], function() {
    return gulp.src('build')
        .pipe(webserver({
            port: 8082,
            open: true,
            fallback: 'index.html'
        }));
});

/**
 * Adds source filename to file like front matter
 */
function fileName(options) {
    return function (files, metalsmith, done) {
        Object.keys(files).forEach(function (file) {
            files[file].original_filename = file;
        });
        done();
    };
}
