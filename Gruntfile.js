var jsFiles = {
	/**
	 * JavaScript 工具库
	 * */
	// jQuery
	'public/script/lib/jquery.min.js': ['bower_components/jquery/dist/jquery.min.js']
	// require
	, 'public/script/lib/require.min.js': ['bower_components/requirejs/require.js']

	, 'public/script/lib/css.js': ['bower_components/require-css/css.js']

	//// underscroe
	//, 'public/script/lib/underscore/underscore.min.js': ['bower_components/underscore/underscore.js']
	//// html5shiv
	//, 'public/script/lib/html5shiv/html5shiv.min.js': ['bower_components/html5shiv/dist/html5shiv.min.js']
	//// modernizr
	//, 'public/script/lib/modernizr/modernizr.js': ['bower_components/modernizr/modernizr.js']
	/**
	 * 数据可视化
	 * */
	// d3
	, 'public/script/lib/d3.min.js': ['bower_components/d3/d3.js']

	///**
	// * UI 框架
	// * */
	//// jQuery UI
	//, 'public/script/lib/jQueryUI/jquery-ui.custom.min.js': ['bower_components/jquery-ui/ui/minified/jquery-ui.custom.min.js']
	//// bootstrap
	//, 'public/script/lib/bootstrap/js/bootstrap.min.js': ['bower_components/bootstrap/dist/js/bootstrap.min.js']
	//// foundation
	//, 'public/script/lib/foundation/js/foundation.min.js': ['bower_components/foundation/js/foundation.min.js']
	///**
	// * MV* 框架
	// * */
	//// Angular
	//, 'public/script/lib/angular/angular.min.js': ['bower_components/angular/angular.min.js']
	//, 'public/script/lib/angular/angular-route.min.js': ['bower_components/angular-route/angular-route.min.js']
	//// Ember
	//, 'public/script/lib/ember/ember.min.js': ['bower_components/ember/ember.js']
	//, 'public/script/lib/ember/ember-data.min.js': ['bower_components/ember-data/ember-data.js']
	//, 'public/script/lib/ember/ember-localstorage_adapter.js': ['bower_components/ember-localstorage-adapter/localstorage_adapter.js']
	///**
	// * 游戏、动画相关框架
	// * 渲染引擎、物理引擎
	// * */
	//// threejs
	//, 'public/script/lib/threejs/three.min.js': ['bower_components/threejs/build/three.min.js']
	//// tweenjs
	//, 'public/script/lib/tweenjs/tween.min.js': ['bower_components/tweenjs/build/tween.min.js']
	//// CutJS
	//, 'public/script/lib/cutjs/cut.web.min.js': ['bower_components/cutjs/dist/cut.web.min.js']
	//// PhysicsJS
	//, 'public/script/lib/physicsjs/physicsjs-full.min.js': ['bower_components/physicsjs/dist/physicsjs-full-0.6.0.min.js']
	//// isomer
	//, 'public/script/lib/isomer/isomer.min.js': ['bower_components/isomer/dist/isomer.min.js']
	//// svg.js
	//, 'public/script/lib/svgjs/svg.min.js': ['bower_components/svg.js/dist/svg.min.js']
	//// kiwi.js
	//, 'public/script/lib/kiwi/kiwi.min.js': ['bower_components/kiwijs/build/kiwi.min.js']
	//// verlet.js
	//, 'public/script/lib/verlet/verlet.min.js': ['bower_components/verlet/js/verlet-1.0.0.min.js']
	//// qunit
	//, 'public/script/lib/qunit/qunit.js': ['bower_components/qunit/qunit/qunit.js']
	/**
	 * 单一功能插件
	 * */
	// Code Mirror
	, 'public/script/plugin/codeMirror/lib/codemirror.js':  ['bower_components/codemirror/lib/codemirror.js']
	, 'public/script/plugin/codeMirror/mode/xml/xml.js':    ['bower_components/codemirror/mode/xml/xml.js']
	, 'public/script/plugin/codeMirror/mode/htmlmixed/htmlmixed.js':    ['bower_components/codemirror/mode/htmlmixed/htmlmixed.js']
	, 'public/script/plugin/codeMirror/mode/javascript/javascript.js':  ['bower_components/codemirror/mode/javascript/javascript.js']
	, 'public/script/plugin/codeMirror/mode/css/css.js':    ['bower_components/codemirror/mode/css/css.js']
	, 'public/script/plugin/codeMirror/addon/comment/comment.js':   ['bower_components/codemirror/addon/comment/comment.js']
	, 'public/script/plugin/codeMirror/addon/comment/continuecomment.js':   ['bower_components/codemirror/addon/comment/continuecomment.js']
	, 'public/script/plugin/codeMirror/addon/fold/foldcode.js':     ['bower_components/codemirror/addon/fold/foldcode.js']
	, 'public/script/plugin/codeMirror/addon/fold/foldgutter.js':   ['bower_components/codemirror/addon/fold/foldgutter.js']
	, 'public/script/plugin/codeMirror/addon/fold/brace-fold.js':	['bower_components/codemirror/addon/fold/brace-fold.js']
	, 'public/script/plugin/codeMirror/addon/fold/xml-fold.js':	    ['bower_components/codemirror/addon/fold/xml-fold.js']

	//// 括号 自动闭合
	//, 'public/script/plugin/codeMirror/addon/edit/closebrackets.js': ['bower_components/codemirror/addon/edit/closebrackets.js']
	//// 标签 自动闭合
	//, 'public/script/plugin/codeMirror/addon/edit/closetag.js': ['bower_components/codemirror/addon/edit/closetag.js']
	//// 全屏显示
	//, 'public/script/plugin/codeMirror/addon/display/fullscreen.js': ['bower_components/codemirror/addon/display/fullscreen.js']

	// placeholder
	, 'public/script/plugin/codeMirror/addon/display/placeholder.js':   ['bower_components/codemirror/addon/display/placeholder.js']

	//// 代码检测
	//, 'public/script/plugin/codeMirror/addon/lint/lint.js': ['bower_components/codemirror/addon/lint/lint.js']
	//, 'public/script/plugin/codeMirror/addon/lint/css-lint.js': ['bower_components/codemirror/addon/lint/css-lint.js']
	//, 'public/script/plugin/codeMirror/addon/lint/javascript-lint.js': ['bower_components/codemirror/addon/lint/javascript-lint.js']
	//, 'public/script/plugin/codeMirror/addon/lint/json-lint.js': ['bower_components/codemirror/addon/lint/json-lint.js']

	// panel
	, 'public/script/plugin/codeMirror/addon/display/panel.js':         ['bower_components/codemirror/addon/display/panel.js']

	// emmet
	, 'public/script/plugin/codeMirror/emmet/emmet.min.js':             ['bower_components/codemirror-emmet/dist/emmet.js']

	//// pace
	//, 'public/script/plugin/pace/pace.min.js': ['bower_components/pace/pace.min.js']
	//// handlebars
	//, 'public/script/plugin/handlebars/handlebars.min.js': ['bower_components/handlebars/handlebars.min.js']
	//// Highcharts
	//, 'public/script/plugin/highcharts/highcharts.js': ['bower_components/highcharts.com/js/highcharts.src.js']
	//, 'public/script/plugin/highcharts/highcharts-3d.js': ['bower_components/highcharts.com/js/highcharts.src.js']
	//, 'public/script/plugin/highcharts/highcharts-more.js': ['bower_components/highcharts.com/js/highcharts-more.src.js']
	//, 'public/script/plugin/highcharts/modules/exporting.js': ['bower_components/highcharts.com/js/modules/exporting.src.js']
	//// highlight
	//, 'public/script/plugin/highlight/highlight.js': ['bower_components/highlightjs/highlight.pack.js']
	//
	//// SyntaxHighlighter
	//, 'public/script/plugin/syntaxhighlighter/XRegExp.js': ['bower_components/SyntaxHighlighter/scripts/XRegExp.js']
	//, 'public/script/plugin/syntaxhighlighter/shCore.js': ['bower_components/SyntaxHighlighter/scripts/shCore.js']
	//, 'public/script/plugin/syntaxhighlighter/shAutoloader.js': ['bower_components/SyntaxHighlighter/scripts/shAutoloader.js']
	//, 'public/script/plugin/syntaxhighlighter/shBrushJScript.js': ['bower_components/SyntaxHighlighter/scripts/shBrushJScript.js']
	//, 'public/script/plugin/syntaxhighlighter/shBrushCss.js': ['bower_components/SyntaxHighlighter/scripts/shBrushCss.js']
	//, 'public/script/plugin/syntaxhighlighter/shBrushXml.js': ['bower_components/SyntaxHighlighter/scripts/shBrushXml.js']
	//
	//// Stellar
	//, 'public/script/plugin/stellar/jquery.stellar.min.js': ['bower_components/jquery.stellar/jquery.stellar.min.js']
	//// scrollReveal
	//, 'public/script/plugin/scrollReveal/scrollReveal.min.js': ['bower_components/scrollReveal.js/dist/scrollReveal.min.js']
	//// skrollr
	//, 'public/script/plugin/skrollr/skrollr.min.js': ['bower_components/skrollr/dist/skrollr.min.js']
	//// transit
	//, 'public/script/plugin/transit/jquery.transit.js': ['bower_components/jquery.transit/jquery.transit.js']
	//// impress
	//, 'public/script/plugin/impress/impress.js': ['bower_components/impress.js/js/impress.js']
	//// chardin.js
	//, 'public/script/plugin/chardin/chardinjs.min.js': ['bower_components/chardin.js/chardinjs.min.js']
	//// intro.js
	//, 'public/script/plugin/intro/intro.js': ['bower_components/intro.js/intro.js']
	//// ZeroClipboard.min.js
	//, 'public/script/plugin/ZeroClipboard/ZeroClipboard.min.js': ['bower_components/zeroclipboard/ZeroClipboard.min.js']
	//// kreate
	//, 'public/script/plugin/kreate/kreate.min.js': ['bower_components/kreate/dist/kreate.min.js']
	//// randomColor
	//, 'public/script/plugin/randomColor/randomColor.js': ['bower_components/randomColor/randomColor.js']
	//// shine
	//, 'public/script/plugin/shine/shine.min.js': ['bower_components/shine/dist/shine.min.js']
	///**
	//* bower 目前未收录
	//* */
	//// facedetection
	//, 'public/script/plugin/facedetection/jquery.facedetection.min.js': ['bower_components/facedetection/jquery.facedetection.min.js']
	//, 'public/script/plugin/facedetection/facedetection/ccv.js': ['bower_components/facedetection/facedetection/ccv.js']
	//, 'public/script/plugin/facedetection/facedetection/face.js': ['bower_components/facedetection/facedetection/face.js']
	//// harmony
	//, 'public/script/plugin/harmony/harmony.js': ['bower_components/harmony/harmony.js']
	//, 'public/script/plugin/harmony/dollar.js': ['bower_components/harmony/dollar.js']
	//, 'impress/impress.js': ['bower_components/impress.js/js/impress.js']
};

// var docConfigure = require('ink-docstrap/template/jsdoc.conf.json');

// docConfigure.templates.systemName = 'New TG Frame';
// docConfigure.templates.theme = 'Cerulean';

module.exports = function(grunt){
	grunt.initConfig({
		// 并行运行任务
		concurrent: {
			destiny: [
//				'htmlmin'
//				,
				'less'
				, 'cssmin'
//				, requirejs
				, 'uglify'
//				, 'copy'
			]
			, destinyBuild: [
				'less'
				, 'uglify:destinyBuild'
			]
		}

		, htmlmin: {
			destiny: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'public/index.html': 'tpl/index.html',
					'public/module.html': 'tpl/module.html'
				}
			}
		}

		, cssmin: {
			destiny: {
				options:{},
				files: [{
					expand: true
					, cwd: 'bower_components/codemirror/lib/'
					, src: ['*.css']
					, dest: 'public/script/plugin/codeMirror/lib/'
				}, {
					expand: true
					, cwd: 'bower_components/codemirror/addon/fold/'
					, src: ['*.css']
					, dest: 'public/script/plugin/codeMirror/addon/fold/'
				}, {
					//	expand: true
					//	, cwd: 'bower_components/codemirror/addon/lint/'
					//	, src: ['*.css']
					//	, dest: 'public/script/plugin/codeMirror/addon/lint/'
					//}, {
					expand: true
					, cwd: 'bower_components/codemirror/theme/'
					, src: ['*.css']
					, dest: 'public/script/plugin/codeMirror/theme/'
				}]
//				{
////					// jQuery UI
////					'public/script/lib/jQueryUI/theme/base/jquery-ui.min.css': ['bower_components/jquery-ui/themes/base/minified/jquery-ui.min.css']
////					// bootstrap
////					, 'public/script/lib/bootstrap/css/bootstrap.min.css': ['bower_components/bootstrap/dist/css/bootstrap.min.css']
////					, 'public/script/lib/bootstrap/css/bootstrap-theme.min.css': ['bower_components/bootstrap/dist/css/bootstrap-theme.min.css']
////					// foundation
////					, 'public/script/lib/foundation/css/foundation.min.css': ['bower_components/foundation/css/foundation.css']
////					// pure
////					, 'public/style/lib/pure/pure.min.css': ['bower_components/pure/pure-min.css']
////					// animate.css
////					, 'public/style/lib/animate/animate.min.css': ['bower_components/animate.css/animate.min.css']
////					// Buttons
////					, 'public/style/lib/buttons/buttons.css': ['bower_components/Buttons/css/buttons.css']
////					// csshake
////					, 'public/style/lib/csshake/csshake.min.css': ['bower_components/csshake/csshake.min.css']
////					// font-awesome
////					, 'public/style/lib/font-awesome/css/font-awesome.min.css': ['bower_components/font-awesome/css/font-awesome.min.css']
////					// Hover
////					, 'public/style/lib/hover/hover.min.css': ['bower_components/Hover/css/hover-min.css']
////					// pace themes
////					, 'public/script/plugin/pace/themes/pace-theme-barber-shop.css': ['bower_components/pace/themes/pace-theme-barber-shop.css']
////					, 'public/script/plugin/pace/themes/pace-theme-big-counter.css': ['bower_components/pace/themes/pace-theme-big-counter.css']
////					, 'public/script/plugin/pace/themes/pace-theme-bounce.css': ['bower_components/pace/themes/pace-theme-bounce.css']
////					, 'public/script/plugin/pace/themes/pace-theme-center-atom.css': ['bower_components/pace/themes/pace-theme-center-atom.css']
////					, 'public/script/plugin/pace/themes/pace-theme-center-circle.css': ['bower_components/pace/themes/pace-theme-center-circle.css']
////					, 'public/script/plugin/pace/themes/pace-theme-center-radar.css': ['bower_components/pace/themes/pace-theme-center-radar.css']
////					, 'public/script/plugin/pace/themes/pace-theme-center-simple.css': ['bower_components/pace/themes/pace-theme-center-simple.css']
////					, 'public/script/plugin/pace/themes/pace-theme-corner-indicator.css': ['bower_components/pace/themes/pace-theme-corner-indicator.css']
////					, 'public/script/plugin/pace/themes/pace-theme-fill-left.css': ['bower_components/pace/themes/pace-theme-fill-left.css']
////					, 'public/script/plugin/pace/themes/pace-theme-flash.css': ['bower_components/pace/themes/pace-theme-flash.css']
////					, 'public/script/plugin/pace/themes/pace-theme-flat-top.css': ['bower_components/pace/themes/pace-theme-flat-top.css']
////					, 'public/script/plugin/pace/themes/pace-theme-loading-bar.css': ['bower_components/pace/themes/pace-theme-loading-bar.css']
////					, 'public/script/plugin/pace/themes/pace-theme-mac-osx.css': ['bower_components/pace/themes/pace-theme-mac-osx.css']
////					, 'public/script/plugin/pace/themes/pace-theme-minimal.css': ['bower_components/pace/themes/pace-theme-minimal.css']
//					// Code Mirror
//					//,
//					'public/script/plugin/codeMirror/lib/codemirror.css': ['bower_components/codemirror/lib/codemirror.css']
//					, 'public/script/plugin/codeMirror/addon/fold/foldgutter.css': ['bower_components/codemirror/addon/fold/foldgutter.css']
//					, 'public/script/theme/eclipse.css': ['bower_components/codemirror/theme/eclipse.css']
//					, 'public/script/theme/eclipse.css': ['bower_components/codemirror/theme/eclipse.css']
//
////					// highlight
////					, 'public/script/plugin/highlight/style/default.css': ['bower_components/highlightjs/styles/default.css']
////					, 'public/script/plugin/highlight/style/arta.css': ['bower_components/highlightjs/styles/arta.css']
////					, 'public/script/plugin/highlight/style/ascetic.css': ['bower_components/highlightjs/styles/ascetic.css']
////					, 'public/script/plugin/highlight/style/atelier-dune.dark.css': ['bower_components/highlightjs/styles/atelier-dune.dark.css']
////					, 'public/script/plugin/highlight/style/atelier-dune.light.css': ['bower_components/highlightjs/styles/atelier-dune.light.css']
////					, 'public/script/plugin/highlight/style/atelier-forest.dark.css': ['bower_components/highlightjs/styles/atelier-forest.dark.css']
////					, 'public/script/plugin/highlight/style/atelier-forest.light.css': ['bower_components/highlightjs/styles/atelier-forest.light.css']
////					, 'public/script/plugin/highlight/style/atelier-heath.dark.css': ['bower_components/highlightjs/styles/atelier-heath.dark.css']
////					, 'public/script/plugin/highlight/style/atelier-heath.light.css': ['bower_components/highlightjs/styles/atelier-heath.light.css']
////					, 'public/script/plugin/highlight/style/atelier-lakeside.dark.css': ['bower_components/highlightjs/styles/atelier-lakeside.dark.css']
////					, 'public/script/plugin/highlight/style/atelier-lakeside.light.css': ['bower_components/highlightjs/styles/atelier-lakeside.light.css']
////					, 'public/script/plugin/highlight/style/atelier-seaside.dark.css': ['bower_components/highlightjs/styles/atelier-seaside.dark.css']
////					, 'public/script/plugin/highlight/style/atelier-seaside.light.css': ['bower_components/highlightjs/styles/atelier-seaside.light.css']
////					, 'public/script/plugin/highlight/style/brown_paper.css': ['bower_components/highlightjs/styles/brown_paper.css']
////					, 'public/script/plugin/highlight/style/dark.css': ['bower_components/highlightjs/styles/dark.css']
////					, 'public/script/plugin/highlight/style/docco.css': ['bower_components/highlightjs/styles/docco.css']
////					, 'public/script/plugin/highlight/style/far.css': ['bower_components/highlightjs/styles/far.css']
////					, 'public/script/plugin/highlight/style/foundation.css': ['bower_components/highlightjs/styles/foundation.css']
////					, 'public/script/plugin/highlight/style/github.css': ['bower_components/highlightjs/styles/github.css']
////					, 'public/script/plugin/highlight/style/googlecode.css': ['bower_components/highlightjs/styles/googlecode.css']
////					, 'public/script/plugin/highlight/style/idea.css': ['bower_components/highlightjs/styles/idea.css']
////					, 'public/script/plugin/highlight/style/ir_black.css': ['bower_components/highlightjs/styles/ir_black.css']
////					, 'public/script/plugin/highlight/style/magula.css': ['bower_components/highlightjs/styles/magula.css']
////					, 'public/script/plugin/highlight/style/mono-blue.css': ['bower_components/highlightjs/styles/mono-blue.css']
////					, 'public/script/plugin/highlight/style/monokai.css': ['bower_components/highlightjs/styles/monokai.css']
////					, 'public/script/plugin/highlight/style/monokai_sublime.css': ['bower_components/highlightjs/styles/monokai_sublime.css']
////					, 'public/script/plugin/highlight/style/obsidian.css': ['bower_components/highlightjs/styles/obsidian.css']
////					, 'public/script/plugin/highlight/style/paraiso.dark.css': ['bower_components/highlightjs/styles/paraiso.dark.css']
////					, 'public/script/plugin/highlight/style/paraiso.light.css': ['bower_components/highlightjs/styles/paraiso.light.css']
////					, 'public/script/plugin/highlight/style/pojoaque.css': ['bower_components/highlightjs/styles/pojoaque.css']
////					, 'public/script/plugin/highlight/style/railscasts.css': ['bower_components/highlightjs/styles/railscasts.css']
////					, 'public/script/plugin/highlight/style/rainbow.css': ['bower_components/highlightjs/styles/rainbow.css']
////					, 'public/script/plugin/highlight/style/school_book.css': ['bower_components/highlightjs/styles/school_book.css']
////					, 'public/script/plugin/highlight/style/solarized_dark.css': ['bower_components/highlightjs/styles/solarized_dark.css']
////					, 'public/script/plugin/highlight/style/solarized_light.css': ['bower_components/highlightjs/styles/solarized_light.css']
////					, 'public/script/plugin/highlight/style/sunburst.css': ['bower_components/highlightjs/styles/sunburst.css']
////					, 'public/script/plugin/highlight/style/tomorrow.css': ['bower_components/highlightjs/styles/tomorrow.css']
////					, 'public/script/plugin/highlight/style/tomorrow-night.css': ['bower_components/highlightjs/styles/tomorrow-night.css']
////					, 'public/script/plugin/highlight/style/tomorrow-night-blue.css': ['bower_components/highlightjs/styles/tomorrow-night-blue.css']
////					, 'public/script/plugin/highlight/style/tomorrow-night-bright.css': ['bower_components/highlightjs/styles/tomorrow-night-bright.css']
////					, 'public/script/plugin/highlight/style/tomorrow-night-eighties.css': ['bower_components/highlightjs/styles/tomorrow-night-eighties.css']
////					, 'public/script/plugin/highlight/style/vs.css': ['bower_components/highlightjs/styles/vs.css']
////					, 'public/script/plugin/highlight/style/xcode.css': ['bower_components/highlightjs/styles/xcode.css']
////					, 'public/script/plugin/highlight/style/zenburn.css': ['bower_components/highlightjs/styles/zenburn.css']
////					// SyntaxHighlighter
////					, 'public/script/plugin/syntaxhighlighter/style/shCoreDefault.css': ['bower_components/SyntaxHighlighter/styles/shCoreDefault.css']
////					, 'public/script/plugin/syntaxhighlighter/style/shCoreDjango.css': ['bower_components/SyntaxHighlighter/styles/shCoreDjango.css']
////					, 'public/script/plugin/syntaxhighlighter/style/shCoreEclipse.css': ['bower_components/SyntaxHighlighter/styles/shCoreEclipse.css']
////					, 'public/script/plugin/syntaxhighlighter/style/shCoreEmacs.css': ['bower_components/SyntaxHighlighter/styles/shCoreEmacs.css']
////					, 'public/script/plugin/syntaxhighlighter/style/shCoreFadeToGrey.css': ['bower_components/SyntaxHighlighter/styles/shCoreFadeToGrey.css']
////					, 'public/script/plugin/syntaxhighlighter/style/shCoreMDUltra.css': ['bower_components/SyntaxHighlighter/styles/shCoreMDUltra.css']
////					, 'public/script/plugin/syntaxhighlighter/style/shCoreMidnight.css': ['bower_components/SyntaxHighlighter/styles/shCoreMidnight.css']
////					, 'public/script/plugin/syntaxhighlighter/style/shCoreRDark.css': ['bower_components/SyntaxHighlighter/styles/shCoreRDark.css']
////					// chardin.js
////					, 'public/script/plugin/chardin/chardinjs.css': ['bower_components/chardin.js/chardinjs.css']
////					// intro.js
////					, 'public/script/plugin/intro/introjs.css': ['bower_components/intro.js/introjs.css']
////					// qunit
////					, 'public/script/lib/qunit/qunit.css': ['bower_components/qunit/qunit/qunit.css']
//				}
			}
			, destinyBuild: {
				files: [{
					dest: '../destiny_build/zw150026/public/style/', expand: true
					, cwd: 'public/style/', src: ['*.css']
				}, {
					dest: '../destiny_build/zw150026/public/script/plugin/codeMirror/lib/', expand: true
					, cwd: 'public/script/plugin/codeMirror/lib/', src: ['*.css']
				}, {
					dest: '../destiny_build/zw150026/public/script/plugin/codeMirror/addon/fold/', expand: true
					, cwd: 'public/script/plugin/codeMirror/addon/fold/', src: ['*.css']
				}, {
					dest: '../destiny_build/zw150026/public/script/plugin/codeMirror/theme/', expand: true
					, cwd: 'public/script/plugin/codeMirror/theme/', src: ['*.css']
				}]
			}
		}
		, less: {
			destiny: {
				options: {
					//cleancss: true
					//, strictMath: true

					compress: true
					, sourceMap: true
					, sourceMapURL: '/style/style.css.map'
					, sourceMapRootpath: '/'
					, sourceMapFilename: 'public/style/style.css.map'
				},
				files: {
					'public/style/style.css': 'less/style.less'
				}
			}
		}
		, sass: {
			destiny: {
				options: {
					outputStyle: 'compressed'
				}
				, dist: {
					files: {
						'build/sass/style.css': 'test/sass/style.scss'
					}
				}
			}

			, test: {
				options: {
					outputStyle: 'compressed'
				}
				, dist: {
					files: {
						'build/animate.css': 'test/animate.scss'
					}
				}
			}
		}

		, requirejs: {
			destiny: {
				options: {
					baseUrl: 'public/script'
					, dir:'build/requirejs'
					//, optimize: 'uglify2'
					//, out: 'build/requirejs'
					//, paths: {
					//	'jquery': 'lib/jquery.min.js'
					//	//, 'd3': 'lib/d3.min.js'
					//}
					//, fileExclusionRegExp: /\.css/
					, paths: {
						css: 'lib/css'
						, codeEditor: 'module/codeEditor'
					}
					, modules: [{
						name: 'codeEditor'
						, include: [
							'plugin/codeMirror/lib/codemirror.js'
							, 'plugin/codeMirror/mode/xml/xml.js'
							, 'plugin/codeMirror/mode/htmlmixed/htmlmixed.js'
							, 'plugin/codeMirror/mode/javascript/javascript.js'
							, 'plugin/codeMirror/mode/css/css.js'

							, 'plugin/codeMirror/addon/comment/comment.js'
							, 'plugin/codeMirror/addon/comment/continuecomment.js'

							, 'plugin/codeMirror/addon/fold/foldcode.js'
							, 'plugin/codeMirror/addon/fold/foldgutter.js'
							, 'plugin/codeMirror/addon/fold/brace-fold.js'
							, 'plugin/codeMirror/addon/fold/xml-fold.js'

							, 'plugin/codeMirror/addon/display/placeholder.js'
							, 'plugin/codeMirror/addon/display/panel.js'

							, 'plugin/codeMirror/emmet/emmet.min.js'
							, 'module/codeEditor.js'
							//'lib/jquery.min.js'
							//, 'lib/d3.min.js'
						]
					}]
					, optimizeCss: 'standard'
				}
			}
		}
		, rjs: {
			destiny: {
				options: {
				// https://www.npmjs.com/package/grunt-croc-requirejs
				}
			}
		}
		, uglify: {
			destiny: {
				files: jsFiles
			}
			, destinyBuild: {
				files: [{
					expand:true,
					cwd:'public/script/',//js目录下
					src: ['**/*.js'],//所有js文件
					dest: '../destiny_build/zw150026/public/script/'//输出到此目录下
				}]
			}
		}

		, copy: {
			destiny: {
//				files: [{   // jQuery
//					dest: 'public/script/lib/jQuery/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/jquery/dist/jquery.min.map']
//				}, {    // jQuery UI
//					dest: 'public/script/lib/jQueryUI/theme/base/images/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/jquery-ui/themes/base/minified/images/*']
//				}, {    // bootstrap
//					dest: 'public/script/lib/bootstrap/css/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/bootstrap/dist/css/*.map']
//				}, {
//					dest: 'public/script/lib/bootstrap/fonts/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/bootstrap/dist/fonts/*']
//				}, {    // font awesome
//					dest: 'public/style/lib/font-awesome/fonts/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/font-awesome/fonts/*']
//				}, {    // angular
//					dest: 'public/script/lib/angular/', expand: true, flatten: true, filter: 'isFile'
//					, src: [
//						'bower_components/angular/angular.min.js.map'
//						, 'bower_components/angular-route/angular-route.min.js.map'
//					]
//				}, {
//					dest: 'public/script/plugin/ZeroClipboard/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/zeroclipboard/ZeroClipboard.swf']
//				}, {
//					dest: 'public/script/plugin/highlight/style/', expand: true, flatten: true, filter: 'isFile'
//					, src: [
//						'bower_components/highlightjs/styles/brown_papersq.png'
//						, 'bower_components/highlightjs/styles/pojoaque.jpg'
//						, 'bower_components/highlightjs/styles/school_book.png'
//					]
//				}, {
//					dest: 'public/script/plugin/shine/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/shine/dist/shine.min.map']
//				}, {    // Kendo UI
//					dest: 'public/script/lib/kendoUI/js/', expand: true, flatten: true, filter: 'isFile'
//					, src: [
//						'bower_components/kendo-ui/js/kendo.ui.core.min.js'
//						, 'bower_components/kendo-ui/js/kendo.ui.core.min.js.map'
//					]
//				}, {
//					dest: 'public/script/lib/kendoUI/styles/', expand: true, flatten: true, filter: 'isFile'
//					, src: [
//						'bower_components/kendo-ui/styles/web/kendo.common.core.min.css'
//						, 'bower_components/kendo-ui/styles/web/kendo.default.min.css'
//					]
//				}, {
//					dest: 'public/script/lib/kendoUI/styles/default/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/kendo-ui/styles/web/Default/*']
//				}, {
//					dest: 'public/script/lib/kendoUI/styles/textures/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/kendo-ui/styles/web/textures/*']
//				}]
			}
			, destinyBuild: {
				files: [{
					dest: '../destiny_build/zw150026/admin/', expand: true, flatten: true, filter: 'isFile'
					, src: ['admin/*']
				}, {
					dest: '../destiny_build/zw150026/module/', expand: true, filter: 'isFile'
					, cwd: 'module/', src: ['**']
				}, {
					dest: '../destiny_build/zw150026/public/font/', expand: true, flatten: true, filter: 'isFile'
					, src: ['public/font/*']
				}, {
					dest: '../destiny_build/zw150026/public/image/', expand: true, filter: 'isFile'
					, cwd: 'public/image/', src: ['**']
				}, {
					dest: '../destiny_build/zw150026/public/media/', expand: true, flatten: true, filter: 'isFile'
					, src: ['public/media/*']
				}, {
					dest: '../destiny_build/zw150026/tpl/', expand: true, filter: 'isFile'
					, cwd: 'tpl/', src: ['**']
				}, {
				//	dest: '../destiny_build/zw150026/', expand: true, flatten: false, filter: 'isFile'
				//	, src: ['config.js']
				//}, {
				//	dest: '../destiny_build/zw150026/', expand: true, flatten: false, filter: 'isFile'
				//	, src: ['module.js']
				//}, {
				//	dest: '../destiny_build/zw150026/', expand: true, flatten: false, filter: 'isFile'
				//	, src: ['bower.json']
				//}, {
				//	dest: '../destiny_build/zw150026/', expand: true, flatten: false, filter: 'isFile'
				//	, src: ['package.json']
				}]
			}
		}

		, watch: {
			destiny: {
				files: ['less/*.less'
					, 'sass/source/*.scss'
					, 'public/style/*.css'
					, 'public/script/*.js'
				]
				, tasks: ['less']
				, options: {
					livereload: 9090
				}
			}
		}

		, jsdoc: {
			destiny: {
				options: {
					destination: 'doc'
					, access: 'all'
				}
				, src: ['public/script/ui/*.js'
					, 'public/script/module/*.js'
					, 'public/script/module/*/*.js'
				]
			}
			, frame: {
				options: {
					destination: 'static/frameDoc'
					, access: 'all'
					, template : "node_modules/ink-docstrap/template"
					, configure : "./jsdoc.conf.json"
				}
				, src: [
					'../tiangou_web/javascript/libs/testFrame/*.js'
					, '../tiangou_web/javascript/libs/testFrame/model/*.js'
					, '../tiangou_web/javascript/libs/testFrame/biz/*.js'
					, '../tiangou_web/javascript/libs/testFrame/register/*.js'
					, '../tiangou_web/javascript/libs/testFrame/worker/*.js'
					// 'src/lib/frame/*.js'
					// , 'src/lib/frame/model/*.js'
					// , 'src/lib/frame/register/*.js'
					// , 'src/lib/frame/worker/*.js'
				]
			}
		}
	});

	/**
	 * html 文件压缩
	 * */
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	/**
	 * css 编译及压缩
	 * */
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');   // less 编译
	grunt.loadNpmTasks('grunt-sass');   // sass 编辑（基于 node-sass，不是基于 ruby）
	/**
	 * js 打包及压缩
	 * */
	grunt.loadNpmTasks('grunt-contrib-requirejs');  // requirejs 打包
	grunt.loadNpmTasks('grunt-contrib-uglify'); // js 文件压缩

	/**
	 * 文件拷贝移动
	 *  主要为 图片 等静态资源
	 * */
	grunt.loadNpmTasks('grunt-contrib-copy');

	/**
	 * 生成 jsdoc
	 * */
	grunt.loadNpmTasks('grunt-jsdoc');

	/**
	 * 文件监视
	 * */
	grunt.loadNpmTasks('grunt-contrib-watch');

	/**
	 * 多任务并行
	 * */
	grunt.loadNpmTasks('grunt-concurrent');

	// 默认任务
	grunt.registerTask('default', [
		'concurrent:destiny'
	]);
	grunt.registerTask('build', ['concurrent:destinyBuild', 'cssmin:destinyBuild', 'copy:destinyBuild'])

	grunt.registerTask('doc', ['jsdoc:frame']);
};