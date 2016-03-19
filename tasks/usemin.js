var usemin    = require('gulp-usemin');
var connect   = require('gulp-connect');
var minifyCss = require('gulp-minify-css');
var uglify    = require('gulp-uglify');
var rev       = require('gulp-rev');
var config    = require('./build.json');

// usemin服务
gulp.task('usemin', function () {
  	return gulp.src(config.app + '/{,**/}*.html')
	      	.pipe(usemin({
	        	css: [minifyCss(), 'concat'],
	        	vendor: [minifyCss(), 'concat'],
	        	html: [minifyHtml({empty: true})],
	        	js: [uglify(), rev()]
	      	}))
	      	.pipe(gulp.dest(config.build));
});
