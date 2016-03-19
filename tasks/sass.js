var sass   = require('gulp-sass');
var config = require('./build.json');

gulp.task('sass', function () {
	return gulp.src(config.app + "/styles/sass/{,**/}*.{scss, sass}")
        	.pipe(sass())
        	.pipe(gulp.dest(config.app + "/styles"))
        	.pipe(browserSync.stream());
})
