var browserSync = require('browser-sync');
var config      = require('./build.json');

// 服务器启动
gulp.task('serve', function() {
    browserSync.init({
        // https: true,
	    ghostMode: {
	        clicks: true,
	        location: true,
	        forms: true,
	        scroll: true
	    },
	    server: {
		    baseDir: config.app,
		    routes: {
		        "/bower_components": "bower_components"
		    }
		}
    });
});
