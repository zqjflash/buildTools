'use strict';

var watchify   = require('watchify');
var gulp       = require('gulp');
var source     = require('viny-source-stream');
var gutil      = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var assign     = require('lodash.assign');
var Config     = require('./build.json');

// add custom browserify options here
var customOpts = {
	entries: Config.entires,
	debug: !gulp.env.production
}


var opts = assign({}, watchify.args, customOpts);
var b    = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);
b.on('update', bundle);
b.on('log', gutil.log);

// register task
gulp.task('js', function () {
	return b.bundle()
		.on('error',gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('bundle.js'))
		// optional, remove if you don't need to buffer file contents
		.pipe(buffer())
		// optional, remove if you dont want sourcemaps
		// loads map from browserify file
		.pipe(sourcemaps.init({loadMaps: true}))
		// Add transformation tasks to the pipeline here.
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest(Config.build))
});

