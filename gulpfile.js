var gulp = require('gulp');

var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

var bower = require("./bower.json")

var config = {
	dist: './dist',
	src:  './dist/src',
	production: true
};

gulp.task('source', function() {

	gulp.src("src/**/*.js")
		.pipe(plugins.ignore.exclude("gamalto.debug.js"))
		.pipe(plugins.flatten())
		.pipe(gulp.dest(config.src));
});

gulp.task('shaders', function() {
	gulp.src("src/**/*.{vert,frag}")
		.pipe(plugins.flatten())
		.pipe(gulp.dest(config.dist + "/shaders"));
});

gulp.task('default', ["source", "shaders"], function() {

	/* Build */
	gulp.src(bower.main)
		.pipe(plugins.ignore.exclude("**/*.{vert,frag}"))
		.pipe(plugins.ignore.exclude("gamalto.debug.js"))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('gamalto.js'))
		.pipe(plugins.uglify({
			mangle: config.production,
			compress: {
				unsafe: config.production
			},
			output: {
				beautify: !config.production
			}
		}))
		.pipe(plugins.rename({ extname: '.min.js' }))
		.pipe(plugins.sourcemaps.write('./', { includeContent: false, sourceRoot: './src' }))
		.pipe(gulp.dest(config.dist));
});
