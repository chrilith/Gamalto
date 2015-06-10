var gulp = require('gulp');
var exec = require('child_process').exec;
var stylish = require('jshint-stylish');
var rc = require('rc');

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
		.pipe(!config.production ? plugins.util.noop() : plugins.stripComments())
		.pipe(!config.production ? plugins.util.noop() : plugins.cleanhtml())
		.pipe(gulp.dest(config.dist + "/shaders"));
});

/* Documentation with JSDoc, gulp-jsdoc doesn't feed my needs... */

gulp.task('doc', function(done) {
	exec('node ./node_modules/jsdoc/jsdoc -c ./doc/conf.json', function (err, stdout, stderr) {
		done(err);
	});
});

/* Build Gamalto */

gulp.task('all', ["default", "doc"]);

gulp.task('default', ["source", "shaders"], function() {

	gulp.src(bower.main)
		.pipe(plugins.ignore.exclude("**/*.{vert,frag}"))
		.pipe(plugins.ignore.exclude("gamalto.debug.js"))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.concat('gamalto.js'))

		.pipe(!config.production ? plugins.util.noop() :
			plugins.replace(/gamalto\.devel\.(log|warn|assert|error)/g, "console.$1"))
		.pipe(!config.production ? plugins.util.noop() :
			plugins.replace(/gamalto\.devel\.[a-zA-Z]+\(.*?\);/g, ""))

		.pipe(plugins.uglify({
			mangle: config.production,
			compress: {
				unsafe: config.production,
				drop_console: config.production,
				global_defs: { GAMALTO_DEBUG: !config.production }
			},
			output: {
				beautify: !config.production
			}
		}))
		.pipe(plugins.rename({ extname: '.min.js' }))
		.pipe(plugins.sourcemaps.write('./', { includeContent: false, sourceRoot: config.src }))
		.pipe(gulp.dest(config.dist));
});

/* Code quality */

var jsinspectrc = rc('jsinspect', {});

gulp.task('lint', function() {

	return gulp.src("./src/**/*.js")
		.pipe(plugins.jshint())
		.pipe(plugins.jshint.reporter(stylish));
});

gulp.task('duplication', function() {

	return gulp.src("./src/**/*.js")
		.pipe(plugins.jsinspect(jsinspectrc));
});

gulp.task('code-quality', ["lint", "duplication"]);
