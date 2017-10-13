/* Needed gulp config */
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var notify = require('gulp-notify');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var assetsDir = 'assets/';
var outputDir = 'dist/';
var libDir = 'lib/';


/* app Scripts task */
gulp.task('scripts', function() {
    return gulp.src([
        assetsDir + 'js/app.js',
        assetsDir + 'js/config.router.js',
        assetsDir + 'js/main.js',
        assetsDir + 'js/controllers/*.js',
        assetsDir + 'js/directives/*.js',
        assetsDir + 'js/services/*.js'
    ])
        .pipe(concat('ua-gb.js'))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(outputDir + 'js'));
});

/* vendor Scripts task */
gulp.task('scripts-vendor', function() {
    return gulp.src([
        libDir + 'jquery.js',
        libDir + 'angular.js',
        libDir + 'ui-bootstrap-tpls.js',
        libDir + 'angular-ui-router.js',
        libDir + 'angular-ui-notification.min.js',
        libDir + 'smart-table.js',
        libDir + 'ng-google-chart.min.js',
        libDir + 'localforage.min.js'
    ])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest(outputDir + 'js'));
});

/* app css task */
gulp.task('css', function () {
    gulp.src([
        assetsDir + 'css/font.css',
        assetsDir + 'css/app.css'
    ])
        .pipe(plumber())
        .pipe(concat('ua-gb.css'))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(outputDir + 'css'))
        /* Reload the browser CSS after every change */
        .pipe(reload({stream:true}));
});

/* vendor css task */
gulp.task('css-vendor', function () {
    gulp.src([libDir + 'css/*.css'])
        .pipe(plumber())
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest(outputDir + 'css'))
        /* Reload the browser CSS after every change */
        .pipe(reload({stream:true}));
});

/* Font sync task */
gulp.task('font-sync', function () {
    return gulp.src([assetsDir + 'fonts/**/*', libDir + 'fonts/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest(outputDir + 'fonts/'))
        .pipe(browserSync.stream());
});

/* Image sync task */
gulp.task('img-sync', function () {
    return gulp.src([assetsDir + 'img/**/*'])
        .pipe(plumber())
        .pipe(gulp.dest(outputDir + 'img/'))
        .pipe(browserSync.stream());
});

/* Reload task */
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* Prepare Browser-sync for localhost */
gulp.task('browser-sync', function() {
    browserSync.init([outputDir + 'css/*.css', outputDir + 'js/*.js'], {
         port: 8898,
         server: {
             baseDir: './'
         }
    });
});

/* Watch scss, js and html files, doing different things with each. */
gulp.task('default', ['css-vendor', 'css', 'scripts', 'scripts-vendor', 'font-sync', 'img-sync', 'browser-sync'], function () {
    gulp.watch([libDir + '**/*.js'], ['scripts-vendor']);
    gulp.watch([libDir + 'css/*.css'], ['css-vendor']);
    gulp.watch([assetsDir + 'css/*.css'], ['css']);
    gulp.watch([assetsDir + 'js/**/*.js'], ['scripts']);
    gulp.watch([assetsDir + 'fonts/**/*', libDir + 'fonts/**/*'], ['font-sync']);
    gulp.watch([assetsDir + 'img/**/*'], ['img-sync']);
    gulp.watch(['*.html', assetsDir + 'tpl/**/*.html'], ['bs-reload']);
});