var gulp        = require('gulp');
var browserify  = require('gulp-browserify');
var browserSync = require('browser-sync');
// var sass        = require('gulp-sass');
var imagemin    = require('gulp-imagemin');
var clean       = require('gulp-clean');
var cssmin      = require('gulp-cssmin');
var pngquant    = require('imagemin-pngquant');
var rename      = require('gulp-rename');
var connect     = require('gulp-connect');
var usemin      = require('gulp-usemin');
var uglify      = require('gulp-uglify');
var minifyHtml  = require('gulp-minify-html');
var minifyCss   = require('gulp-minify-css');
var runSequence = require('run-sequence');
var rev         = require('gulp-rev');
var wiredep     = require('wiredep').stream;

var config = {
	'oriImgUrl': 'app/src/images/*',
	'destImgUrl': 'build/images',
	'oriJsUrl': 'app/scripts',
	'oriJsName': 'app.js',
	'destJsName': 'bundle.js',
	'buildJsName': 'bundle.min.js',
	'buildJsUrl': 'build/scripts'
};

// imagemin 图片压缩
gulp.task('imagemin', function () {
    return gulp.src(config.oriImgUrl)
        	.pipe(imagemin({
	            progressive: true,
	            svgoPlugins: [{removeViewBox: false}],
	            use: [pngquant()]
	        }))
        	.pipe(gulp.dest(config.destImgUrl));
});

// js代码 browserify处理
gulp.task('browserify', function () {
	console.log('config.oriJsUrl', config.oriJsUrl + '/' + config.oriJsName);
	return gulp.src([config.oriJsUrl + '/' + config.oriJsName])
		    .pipe(browserify({
		      	debug: !gulp.env.production
		    }))
		    .on('error', function(err){
		      console.log(err.message);
		      this.end();
		    })
		    .pipe(rename(config.destJsName))
		    .pipe(gulp.dest(config.oriJsUrl))
})
gulp.task('scripts', function () {
	return gulp.src([config.oriJsUrl + '/' + config.oriJsName])
		    .pipe(browserify({
		      	debug: false
		    }))
		    .on('error', function(err){
		      console.log(err.message);
		      this.end();
		    })
		    .pipe(uglify())
		    .pipe(rename(config.buildJsName))
		    .pipe(gulp.dest(config.buildJsUrl))
})

// 复制文件
gulp.task('copy', function() {
	return gulp.src([config.oriJsUrl + '/' + config.oriJsName])
		.pipe(browserify({
			debug: false
		}))
		.on('error', function(err) {
			console.log(err.message);
			this.end();
		})
		.pipe(rename(config.destJsName))
		.pipe(gulp.dest(config.buildJsUrl))
});

// sass代码编译处理

gulp.task('sass', function () {
	return gulp.src("app/styles/!*.{scss, sass}")
        	.pipe(sass())
        	.pipe(gulp.dest("app/styles"))
        	.pipe(browserSync.stream());
})


gulp.task('css', function () {
	gulp.src("app/styles/*.css")
    	.pipe(gulp.dest("app/styles"))
    	.pipe(browserSync.stream());
})

// css代码压缩
gulp.task('cssmin', function () {
	gulp.src('app/styles/{,**}/*.css')
        .pipe(cssmin())
        .pipe(gulp.dest('tmp/styles'));
})

// watch监听 
gulp.task('watch', function () {
	// 监听sass文件变化
	gulp.watch('app/styles/{,**}/*.{scss, sass}', ['sass']);
	gulp.watch('app/scripts/{, */}*.js', ['browserify']);
	gulp.watch("bower.json", ['wiredep']);
})

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
		    baseDir: "app",
		    routes: {
		        "/bower_components": "bower_components"
		    }
		}
    });

    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch(config.oriJsUrl + '/' + config.destJsName).on('change', browserSync.reload);
});

// clean清理服务，在构建之前清空所有无关文件
gulp.task('clean', function () {
	gulp.src('build')
        .pipe(clean({force: true}))
        .pipe(gulp.dest('.tmp'));
    gulp.src('.tmp')
        .pipe(clean({force: true}))
        .pipe(gulp.dest('.tmp'));
})

// wiredep服务注入
gulp.task('wiredep', function () {
	gulp.src('app/*.html')
		.pipe(wiredep({
	      ignorePath:  /\.\.\//
	    }))
	    .pipe(gulp.dest('app'));
})

// usemin服务
gulp.task('usemin', function () {
  	gulp.src('app/index.html')
      	.pipe(usemin({
        	css: [minifyCss(), 'concat'],
        	vendor: [minifyCss(), 'concat'],
        	html: [minifyHtml({empty: true})],
        	js: [uglify(), rev()]
      	}))
      	.pipe(gulp.dest('build/'));
});

// build构建服务，编译带时间戳文件gulp build
gulp.task('build', ['clean'], function () {
	runSequence('imagemin', 'usemin', 'scripts', 'copy', function() {
        console.log('End build!');
    });
});

gulp.task('default', ['clean', 'watch', 'css', 'wiredep', 'browserify','serve']);






