const { src, dest, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const argv = require('yargs').argv;
const gulpif = require('gulp-if');

const IS_DEV = !(argv.development === undefined);
const IS_PROD = !(argv.production === undefined);

const config = {
	dirDev: 'src/',
	dirProd: 'build/'
}

function browsersync() {
	browserSync.init({ 
		server: {baseDir: config.dirDev}, 
		notify: false, 
		online: true 
	})
}

function html() {
	return src(config.dirDev+'**/*.html')
		.pipe(dest(config.dirProd))
}

function styles() {
	return src(config.dirDev+'scss/main.scss', {sourcemaps: IS_DEV}) 
	.pipe(sass()) 
	.pipe(autoprefixer({
		overrideBrowserslist: ['last 2 versions']
	})) 
	.pipe(gulpif(IS_PROD, cleancss({
		level: { 
			1: {
				specialComments:0}
			}
		}))) 
	.pipe(concat('main.min.css'))
	.pipe(dest(gulpif(IS_DEV, config.dirDev+'css/', config.dirProd+'css/'), {sourcemaps: IS_DEV})) 
	.pipe(gulpif(IS_DEV, browserSync.stream())) 
}

function scripts() {
	return src(config.dirDev+'js/script.js')
	.pipe(concat('script.min.js')) 
	.pipe(gulpif(IS_PROD, uglify()))
	.pipe(dest(gulpif(IS_DEV, config.dirDev+'js/', config.dirProd+'js/'))) 
	.pipe(gulpif(IS_DEV, browserSync.stream()))
}

function images() {
	return src(config.dirDev+'images/**/*.*')
		.pipe(dest(config.dirProd+'images/'))
}

function startwatch() { 
	watch(config.dirDev+'**/*.html').on('change', browserSync.reload);
	watch(config.dirDev+'**/scss/**/*', styles);
	watch([config.dirDev+'**/*.js', '!'+config.dirDev+'**/*.min.js'], scripts); 
}

/*exports.browsersync = browsersync;
exports.scripts = scripts;
exports.styles = styles;*/

exports.build = parallel(html, styles, scripts, images);
exports.dev = parallel(styles, scripts, browsersync, startwatch);