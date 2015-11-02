/**
 * Gulp 运行文件
 * */
var gulp    = require('gulp')

	// 引入插件
	, jshint    = require('gulp-jshint')
	, concat    = require('gulp-concat')
	, uglify    = require('gulp-uglify')
	, rename    = require('gulp-rename')
	;

var SRC = 'public/upload/js/*.js';

// 语法检查
gulp.task('jshint', function(){
	gulp.src( SRC )
		.pipe( jshint() )
		.pipe( jshint.reporter('default') );
});

// 合并文件之后压缩代码
gulp.task('minify', function(){
	gulp.src( SRC )
		.pipe( concat('all.js') )
		.pipe( gulp.dest('public/upload/dist/js') )
		.pipe( uglify() )
		.pipe( rename('all.min.js') )
		.pipe( gulp.dest('public/upload/dist/js') );
});

// 监视文件变化
gulp.task('watch', function(){
	gulp.watch(SRC, ['jshint', 'minify']);
});

// 默认任务
gulp.task('default', ['jshint', 'minify', 'watch']);