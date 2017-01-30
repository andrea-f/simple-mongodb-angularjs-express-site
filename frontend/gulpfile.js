var gulp = require('gulp'),
	concat = require('gulp-concat'),
    autoprefix = require('gulp-autoprefixer'),
    rename = require('gulp-rename'),
    stripDebug = require('gulp-strip-debug'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed'),
    minifyHTML = require('gulp-minify-html'),
    replace = require('gulp-replace'),
    clean = require('gulp-clean');

gulp.task('minify-views-html', function() {
	var opts = {empty:true, quotes:true};
	var htmlPath = {htmlSrc:['./app/views/*.html'], htmlDest:'./dist/views'};
 	return gulp.src(htmlPath.htmlSrc)
    .pipe(changed(htmlPath.htmlDest))
    .pipe(minifyHTML(opts))
    .pipe(gulp.dest(htmlPath.htmlDest));
});

gulp.task('minify-index-html', function() {
	var opts = {empty:true, quotes:true};
	var htmlIndexPath = {htmlSrc:['./app/index.html'], htmlDest:'./dist'};
	return gulp.src(htmlIndexPath.htmlSrc)
	    .pipe(changed(htmlIndexPath.htmlDest))
	    .pipe(replace('<script src="main.js"></script>', '<script src="app.min.js"></script>'))
	    .pipe(replace('<script src="app.table.component.js"></script>', ''))
	    .pipe(replace('<script src="app.update.component.js"></script>', ''))
	    .pipe(replace('<script src="../node_modules/angular-cookies/angular-cookies.min.js"></script>', ''))
	    .pipe(minifyHTML(opts))
	    .pipe(gulp.dest(htmlIndexPath.htmlDest));
});

gulp.task('bundle-js', function() {
	var jsPath = {jsSrc:['./app/*.js'], jsDest:'./dist'};
	gulp.src(jsPath.jsSrc)
	    .pipe(concat('app.js'))
	    .pipe(replace('http://localhost:3000/api/bikes/', 'http://backend:3000/api/bikes/'))
	    .pipe(stripDebug())
	    .pipe(ngAnnotate())
	    .pipe(uglify())
	    .pipe(rename({ suffix: '.min' }))
	    .pipe(gulp.dest(jsPath.jsDest));
});


gulp.task('watch', ['minify-index-html', 'bundle-js', 'minify-views-html'], function() {
	gulp.watch('./app/views/*.html', ['minify-views-html']);
	gulp.watch('./app/index.html', ['minify-index-html']);
	gulp.watch('./app/*.js', ['bundle-js']);
});

gulp.task('clean', function() {
	return gulp.src(['dist'], {read: false})
    	.pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.run('minify-index-html', 'bundle-js', 'minify-views-html');
});
