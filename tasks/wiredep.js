var wiredep = require('wiredep').stream;

// wiredep服务注入
gulp.task('wiredep', function () {
	gulp.src('app/*.html')
		.pipe(wiredep({
	      ignorePath:  /\.\.\//
	    }))
	    .pipe(gulp.dest('app'));
	    
	gulp.watch("bower.json", ['wiredep']);
})

