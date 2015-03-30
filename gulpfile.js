var gulp = require('gulp');
var exec = require('child_process').exec;

var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'del']
});

/* Command line options:

		--mode		Set it to "production" for complete minification
 */

var env = plugins.util.env;
var bower = require("./bower.json");

var config = {
	dist: './dist',
	src:  './src',
	code: './dist/src',
	production: env.mode == "production"
};

/* Copy source files in place for mapping */

gulp.task('source', function() {

	gulp.src(config.src + "/**/*.js")
		.pipe(plugins.ignore.exclude("gamalto.debug.js"))
		.pipe(plugins.flatten())
		.pipe(gulp.dest(config.code));
});

/* Copy shaders files for distribution */

gulp.task('shaders', function() {

	gulp.src(config.src + "/**/*.{vert,frag}")
		.pipe(plugins.flatten())
		.pipe(config.production ? plugins.stripComments() : plugins.util.noop())
		.pipe(config.production ? plugins.cleanhtml() : plugins.util.noop())
		.pipe(gulp.dest(config.dist + "/shaders"));
});

/* Documentation with JSDoc, gulp-jsdoc doesn't feed my needs... */

gulp.task('docs', function(done) {
	exec('jsdoc -c ./doc/conf.json', function (err, stdout, stderr) {
		done();
	});	
});

/* Build Gamalto */

gulp.task('default', ["source", "shaders"/*, "docs"*/], function() {

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
		.pipe(plugins.sourcemaps.write('./', { includeContent: false, sourceRoot: config.src }))
		.pipe(gulp.dest(config.dist));
});
