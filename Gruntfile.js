module.exports = function(grunt){
	grunt.initConfig({
		concurrent: {
			destiny: ['uglify'
				, 'less'
				, 'cssmin'
//				, 'htmlmin'
				, 'copy'
			]
		}
		, uglify: {
			destiny: {
				files: {
					/**
					 * JavaScript 工具库
					 * */
					// jQuery
					'script/lib/jquery/jquery.min.js': ['bower_components/jquery/dist/jquery.min.js']
					// require
					, 'script/lib/require/require.min.js': ['bower_components/requirejs/require.js']

//					// underscroe
//					, 'script/lib/underscore/underscore.min.js': ['bower_components/underscore/underscore.js']
//					// html5shiv
//					, 'script/lib/html5shiv/html5shiv.min.js': ['bower_components/html5shiv/dist/html5shiv.min.js']
//					// modernizr
//					, 'script/lib/modernizr/modernizr.js': ['bower_components/modernizr/modernizr.js']
//					/**
//					 * UI 框架
//					 * */
//					// jQuery UI
//					, 'script/lib/jQueryUI/jquery-ui.custom.min.js': ['bower_components/jquery-ui/ui/minified/jquery-ui.custom.min.js']
//					// bootstrap
//					, 'script/lib/bootstrap/js/bootstrap.min.js': ['bower_components/bootstrap/dist/js/bootstrap.min.js']
//					// foundation
//					, 'script/lib/foundation/js/foundation.min.js': ['bower_components/foundation/js/foundation.min.js']
//					/**
//					 * MV* 框架
//					 * */
//					// Angular
//					, 'script/lib/angular/angular.min.js': ['bower_components/angular/angular.min.js']
//					, 'script/lib/angular/angular-route.min.js': ['bower_components/angular-route/angular-route.min.js']
//					// Ember
//					, 'script/lib/ember/ember.min.js': ['bower_components/ember/ember.js']
//					, 'script/lib/ember/ember-data.min.js': ['bower_components/ember-data/ember-data.js']
//					, 'script/lib/ember/ember-localstorage_adapter.js': ['bower_components/ember-localstorage-adapter/localstorage_adapter.js']
					/**
					 * 数据可视化
					 * */
					// d3
					, 'script/lib/d3/d3.min.js': ['bower_components/d3/d3.js']
//					/**
//					 * 游戏、动画相关框架
//					 * 渲染引擎、物理引擎
//					 * */
//					// threejs
//					, 'script/lib/threejs/three.min.js': ['bower_components/threejs/build/three.min.js']
//			        // tweenjs
//					, 'script/lib/tweenjs/tween.min.js': ['bower_components/tweenjs/build/tween.min.js']
//					// CutJS
//					, 'script/lib/cutjs/cut.web.min.js': ['bower_components/cutjs/dist/cut.web.min.js']
//					// PhysicsJS
//					, 'script/lib/physicsjs/physicsjs-full.min.js': ['bower_components/physicsjs/dist/physicsjs-full-0.6.0.min.js']
//					// isomer
//					, 'script/lib/isomer/isomer.min.js': ['bower_components/isomer/dist/isomer.min.js']
//					// svg.js
//					, 'script/lib/svgjs/svg.min.js': ['bower_components/svg.js/dist/svg.min.js']
//					// kiwi.js
//					, 'script/lib/kiwi/kiwi.min.js': ['bower_components/kiwijs/build/kiwi.min.js']
//					// verlet.js
//					, 'script/lib/verlet/verlet.min.js': ['bower_components/verlet/js/verlet-1.0.0.min.js']
//					// qunit
//					, 'script/lib/qunit/qunit.js': ['bower_components/qunit/qunit/qunit.js']
					/**
					 * 单一功能插件
					 * */
					// Code Mirror
					, 'script/plugin/codeMirror/lib/codemirror.js': ['bower_components/codemirror/lib/codemirror.js']
					, 'script/plugin/codeMirror/mode/xml/xml.js': ['bower_components/codemirror/mode/xml/xml.js']
					, 'script/plugin/codeMirror/mode/htmlmixed/htmlmixed.js': ['bower_components/codemirror/mode/htmlmixed/htmlmixed.js']
					, 'script/plugin/codeMirror/mode/javascript/javascript.js': ['bower_components/codemirror/mode/javascript/javascript.js']
					, 'script/plugin/codeMirror/mode/css/css.js': ['bower_components/codemirror/mode/css/css.js']
					, 'script/plugin/codeMirror/addon/comment/comment.js': ['bower_components/codemirror/addon/comment/comment.js']
					, 'script/plugin/codeMirror/addon/comment/continuecomment.js': ['bower_components/codemirror/addon/comment/continuecomment.js']
					, 'script/plugin/codeMirror/addon/fold/foldcode.js': ['bower_components/codemirror/addon/fold/foldcode.js']
					, 'script/plugin/codeMirror/addon/fold/foldgutter.js': ['bower_components/codemirror/addon/fold/foldgutter.js']
					, 'script/plugin/codeMirror/addon/fold/brace-fold.js': ['bower_components/codemirror/addon/fold/brace-fold.js']
					, 'script/plugin/codeMirror/addon/fold/xml-fold.js': ['bower_components/codemirror/addon/fold/xml-fold.js']
					, 'script/plugin/codeMirror/emmet/emmet.min.js': ['bower_components/codemirror-emmet/dist/emmet.min.js']
//					// pace
//					, 'script/plugin/pace/pace.min.js': ['bower_components/pace/pace.min.js']
//					// handlebars
//					, 'script/plugin/handlebars/handlebars.min.js': ['bower_components/handlebars/handlebars.min.js']
//					// Highcharts
//					, 'script/plugin/highcharts/highcharts.js': ['bower_components/highcharts.com/js/highcharts.src.js']
//					, 'script/plugin/highcharts/highcharts-3d.js': ['bower_components/highcharts.com/js/highcharts.src.js']
//					, 'script/plugin/highcharts/highcharts-more.js': ['bower_components/highcharts.com/js/highcharts-more.src.js']
//					, 'script/plugin/highcharts/modules/exporting.js': ['bower_components/highcharts.com/js/modules/exporting.src.js']
//					// highlight
//					, 'script/plugin/highlight/highlight.js': ['bower_components/highlightjs/highlight.pack.js']

					// SyntaxHighlighter
					, 'script/plugin/syntaxhighlighter/XRegExp.js': ['bower_components/SyntaxHighlighter/scripts/XRegExp.js']
					, 'script/plugin/syntaxhighlighter/shCore.js': ['bower_components/SyntaxHighlighter/scripts/shCore.js']
//					, 'script/plugin/syntaxhighlighter/shAutoloader.js': ['bower_components/SyntaxHighlighter/scripts/shAutoloader.js']
					, 'script/plugin/syntaxhighlighter/shBrushJScript.js': ['bower_components/SyntaxHighlighter/scripts/shBrushJScript.js']
					, 'script/plugin/syntaxhighlighter/shBrushCss.js': ['bower_components/SyntaxHighlighter/scripts/shBrushCss.js']
					, 'script/plugin/syntaxhighlighter/shBrushXml.js': ['bower_components/SyntaxHighlighter/scripts/shBrushXml.js']

//					// Stellar
//					, 'script/plugin/stellar/jquery.stellar.min.js': ['bower_components/jquery.stellar/jquery.stellar.min.js']
//					// scrollReveal
//					, 'script/plugin/scrollReveal/scrollReveal.min.js': ['bower_components/scrollReveal.js/dist/scrollReveal.min.js']
//					// skrollr
//					, 'script/plugin/skrollr/skrollr.min.js': ['bower_components/skrollr/dist/skrollr.min.js']
//					// transit
//					, 'script/plugin/transit/jquery.transit.js': ['bower_components/jquery.transit/jquery.transit.js']
//					// impress
//					, 'script/plugin/impress/impress.js': ['bower_components/impress.js/js/impress.js']
//					// chardin.js
//					, 'script/plugin/chardin/chardinjs.min.js': ['bower_components/chardin.js/chardinjs.min.js']
//					// intro.js
//					, 'script/plugin/intro/intro.js': ['bower_components/intro.js/intro.js']
//					// ZeroClipboard.min.js
//					, 'script/plugin/ZeroClipboard/ZeroClipboard.min.js': ['bower_components/zeroclipboard/ZeroClipboard.min.js']
//					// kreate
//					, 'script/plugin/kreate/kreate.min.js': ['bower_components/kreate/dist/kreate.min.js']
//					// randomColor
//					, 'script/plugin/randomColor/randomColor.js': ['bower_components/randomColor/randomColor.js']
//					// shine
//					, 'script/plugin/shine/shine.min.js': ['bower_components/shine/dist/shine.min.js']
//					/**
//					 * bower 目前未收录
//					 * */
//					// facedetection
//					, 'script/plugin/facedetection/jquery.facedetection.js': ['bower_components/facedetection/jquery.facedetection.js']
//					, 'script/plugin/facedetection/facedetection/ccv.js': ['bower_components/facedetection/facedetection/ccv.js']
//					, 'script/plugin/facedetection/facedetection/face.js': ['bower_components/facedetection/facedetection/face.js']
//					// harmony
//					, 'script/plugin/harmony/harmony.js': ['bower_components/harmony/harmony.js']
//					, 'script/plugin/harmony/dollar.js': ['bower_components/harmony/dollar.js']
					, 'impress/impress.js': ['bower_components/impress.js/js/impress.js']
				}
			}
		}
		, cssmin: {
			destiny: {
				options:{},
				files: {
//					// jQuery UI
//					'script/lib/jQueryUI/theme/base/jquery-ui.min.css': ['bower_components/jquery-ui/themes/base/minified/jquery-ui.min.css']
//					// bootstrap
//					, 'script/lib/bootstrap/css/bootstrap.min.css': ['bower_components/bootstrap/dist/css/bootstrap.min.css']
//					, 'script/lib/bootstrap/css/bootstrap-theme.min.css': ['bower_components/bootstrap/dist/css/bootstrap-theme.min.css']
//					// foundation
//					, 'script/lib/foundation/css/foundation.min.css': ['bower_components/foundation/css/foundation.css']
//					// pure
//					, 'style/lib/pure/pure.min.css': ['bower_components/pure/pure-min.css']
//					// animate.css
//					, 'style/lib/animate/animate.min.css': ['bower_components/animate.css/animate.min.css']
//					// Buttons
//					, 'style/lib/buttons/buttons.css': ['bower_components/Buttons/css/buttons.css']
//					// csshake
//					, 'style/lib/csshake/csshake.min.css': ['bower_components/csshake/csshake.min.css']
//					// font-awesome
//					, 'style/lib/font-awesome/css/font-awesome.min.css': ['bower_components/font-awesome/css/font-awesome.min.css']
//					// Hover
//					, 'style/lib/hover/hover.min.css': ['bower_components/Hover/css/hover-min.css']
//					// pace themes
//					, 'script/plugin/pace/themes/pace-theme-barber-shop.css': ['bower_components/pace/themes/pace-theme-barber-shop.css']
//					, 'script/plugin/pace/themes/pace-theme-big-counter.css': ['bower_components/pace/themes/pace-theme-big-counter.css']
//					, 'script/plugin/pace/themes/pace-theme-bounce.css': ['bower_components/pace/themes/pace-theme-bounce.css']
//					, 'script/plugin/pace/themes/pace-theme-center-atom.css': ['bower_components/pace/themes/pace-theme-center-atom.css']
//					, 'script/plugin/pace/themes/pace-theme-center-circle.css': ['bower_components/pace/themes/pace-theme-center-circle.css']
//					, 'script/plugin/pace/themes/pace-theme-center-radar.css': ['bower_components/pace/themes/pace-theme-center-radar.css']
//					, 'script/plugin/pace/themes/pace-theme-center-simple.css': ['bower_components/pace/themes/pace-theme-center-simple.css']
//					, 'script/plugin/pace/themes/pace-theme-corner-indicator.css': ['bower_components/pace/themes/pace-theme-corner-indicator.css']
//					, 'script/plugin/pace/themes/pace-theme-fill-left.css': ['bower_components/pace/themes/pace-theme-fill-left.css']
//					, 'script/plugin/pace/themes/pace-theme-flash.css': ['bower_components/pace/themes/pace-theme-flash.css']
//					, 'script/plugin/pace/themes/pace-theme-flat-top.css': ['bower_components/pace/themes/pace-theme-flat-top.css']
//					, 'script/plugin/pace/themes/pace-theme-loading-bar.css': ['bower_components/pace/themes/pace-theme-loading-bar.css']
//					, 'script/plugin/pace/themes/pace-theme-mac-osx.css': ['bower_components/pace/themes/pace-theme-mac-osx.css']
//					, 'script/plugin/pace/themes/pace-theme-minimal.css': ['bower_components/pace/themes/pace-theme-minimal.css']
					// Code Mirror
					//,
				'script/plugin/codeMirror/lib/codemirror.css': ['bower_components/codemirror/lib/codemirror.css']
					, 'script/plugin/codeMirror/addon/fold/foldgutter.css': ['bower_components/codemirror/addon/fold/foldgutter.css']
//					// highlight
//					, 'script/plugin/highlight/style/default.css': ['bower_components/highlightjs/styles/default.css']
//					, 'script/plugin/highlight/style/arta.css': ['bower_components/highlightjs/styles/arta.css']
//					, 'script/plugin/highlight/style/ascetic.css': ['bower_components/highlightjs/styles/ascetic.css']
//					, 'script/plugin/highlight/style/atelier-dune.dark.css': ['bower_components/highlightjs/styles/atelier-dune.dark.css']
//					, 'script/plugin/highlight/style/atelier-dune.light.css': ['bower_components/highlightjs/styles/atelier-dune.light.css']
//					, 'script/plugin/highlight/style/atelier-forest.dark.css': ['bower_components/highlightjs/styles/atelier-forest.dark.css']
//					, 'script/plugin/highlight/style/atelier-forest.light.css': ['bower_components/highlightjs/styles/atelier-forest.light.css']
//					, 'script/plugin/highlight/style/atelier-heath.dark.css': ['bower_components/highlightjs/styles/atelier-heath.dark.css']
//					, 'script/plugin/highlight/style/atelier-heath.light.css': ['bower_components/highlightjs/styles/atelier-heath.light.css']
//					, 'script/plugin/highlight/style/atelier-lakeside.dark.css': ['bower_components/highlightjs/styles/atelier-lakeside.dark.css']
//					, 'script/plugin/highlight/style/atelier-lakeside.light.css': ['bower_components/highlightjs/styles/atelier-lakeside.light.css']
//					, 'script/plugin/highlight/style/atelier-seaside.dark.css': ['bower_components/highlightjs/styles/atelier-seaside.dark.css']
//					, 'script/plugin/highlight/style/atelier-seaside.light.css': ['bower_components/highlightjs/styles/atelier-seaside.light.css']
//					, 'script/plugin/highlight/style/brown_paper.css': ['bower_components/highlightjs/styles/brown_paper.css']
//					, 'script/plugin/highlight/style/dark.css': ['bower_components/highlightjs/styles/dark.css']
//					, 'script/plugin/highlight/style/docco.css': ['bower_components/highlightjs/styles/docco.css']
//					, 'script/plugin/highlight/style/far.css': ['bower_components/highlightjs/styles/far.css']
//					, 'script/plugin/highlight/style/foundation.css': ['bower_components/highlightjs/styles/foundation.css']
//					, 'script/plugin/highlight/style/github.css': ['bower_components/highlightjs/styles/github.css']
//					, 'script/plugin/highlight/style/googlecode.css': ['bower_components/highlightjs/styles/googlecode.css']
//					, 'script/plugin/highlight/style/idea.css': ['bower_components/highlightjs/styles/idea.css']
//					, 'script/plugin/highlight/style/ir_black.css': ['bower_components/highlightjs/styles/ir_black.css']
//					, 'script/plugin/highlight/style/magula.css': ['bower_components/highlightjs/styles/magula.css']
//					, 'script/plugin/highlight/style/mono-blue.css': ['bower_components/highlightjs/styles/mono-blue.css']
//					, 'script/plugin/highlight/style/monokai.css': ['bower_components/highlightjs/styles/monokai.css']
//					, 'script/plugin/highlight/style/monokai_sublime.css': ['bower_components/highlightjs/styles/monokai_sublime.css']
//					, 'script/plugin/highlight/style/obsidian.css': ['bower_components/highlightjs/styles/obsidian.css']
//					, 'script/plugin/highlight/style/paraiso.dark.css': ['bower_components/highlightjs/styles/paraiso.dark.css']
//					, 'script/plugin/highlight/style/paraiso.light.css': ['bower_components/highlightjs/styles/paraiso.light.css']
//					, 'script/plugin/highlight/style/pojoaque.css': ['bower_components/highlightjs/styles/pojoaque.css']
//					, 'script/plugin/highlight/style/railscasts.css': ['bower_components/highlightjs/styles/railscasts.css']
//					, 'script/plugin/highlight/style/rainbow.css': ['bower_components/highlightjs/styles/rainbow.css']
//					, 'script/plugin/highlight/style/school_book.css': ['bower_components/highlightjs/styles/school_book.css']
//					, 'script/plugin/highlight/style/solarized_dark.css': ['bower_components/highlightjs/styles/solarized_dark.css']
//					, 'script/plugin/highlight/style/solarized_light.css': ['bower_components/highlightjs/styles/solarized_light.css']
//					, 'script/plugin/highlight/style/sunburst.css': ['bower_components/highlightjs/styles/sunburst.css']
//					, 'script/plugin/highlight/style/tomorrow.css': ['bower_components/highlightjs/styles/tomorrow.css']
//					, 'script/plugin/highlight/style/tomorrow-night.css': ['bower_components/highlightjs/styles/tomorrow-night.css']
//					, 'script/plugin/highlight/style/tomorrow-night-blue.css': ['bower_components/highlightjs/styles/tomorrow-night-blue.css']
//					, 'script/plugin/highlight/style/tomorrow-night-bright.css': ['bower_components/highlightjs/styles/tomorrow-night-bright.css']
//					, 'script/plugin/highlight/style/tomorrow-night-eighties.css': ['bower_components/highlightjs/styles/tomorrow-night-eighties.css']
//					, 'script/plugin/highlight/style/vs.css': ['bower_components/highlightjs/styles/vs.css']
//					, 'script/plugin/highlight/style/xcode.css': ['bower_components/highlightjs/styles/xcode.css']
//					, 'script/plugin/highlight/style/zenburn.css': ['bower_components/highlightjs/styles/zenburn.css']

					// SyntaxHighlighter
					,
				'script/plugin/syntaxhighlighter/style/shCoreDefault.css': ['bower_components/SyntaxHighlighter/styles/shCoreDefault.css']
//					, 'script/plugin/syntaxhighlighter/style/shCoreDjango.css': ['bower_components/SyntaxHighlighter/styles/shCoreDjango.css']
//					, 'script/plugin/syntaxhighlighter/style/shCoreEclipse.css': ['bower_components/SyntaxHighlighter/styles/shCoreEclipse.css']
//					, 'script/plugin/syntaxhighlighter/style/shCoreEmacs.css': ['bower_components/SyntaxHighlighter/styles/shCoreEmacs.css']
//					, 'script/plugin/syntaxhighlighter/style/shCoreFadeToGrey.css': ['bower_components/SyntaxHighlighter/styles/shCoreFadeToGrey.css']
//					, 'script/plugin/syntaxhighlighter/style/shCoreMDUltra.css': ['bower_components/SyntaxHighlighter/styles/shCoreMDUltra.css']
//					, 'script/plugin/syntaxhighlighter/style/shCoreMidnight.css': ['bower_components/SyntaxHighlighter/styles/shCoreMidnight.css']
//					, 'script/plugin/syntaxhighlighter/style/shCoreRDark.css': ['bower_components/SyntaxHighlighter/styles/shCoreRDark.css']

//					// chardin.js
//					, 'script/plugin/chardin/chardinjs.css': ['bower_components/chardin.js/chardinjs.css']
//					// intro.js
//					, 'script/plugin/intro/introjs.css': ['bower_components/intro.js/introjs.css']
//					// qunit
//					, 'script/lib/qunit/qunit.css': ['bower_components/qunit/qunit/qunit.css']
				}
			}
		}
		, copy: {
			destiny: {
//				files: [{   // jQuery
//					dest: 'script/lib/jQuery/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/jquery/dist/jquery.min.map']
//				}, {    // jQuery UI
//					dest: 'script/lib/jQueryUI/theme/base/images/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/jquery-ui/themes/base/minified/images/*']
//				}, {    // bootstrap
//					dest: 'script/lib/bootstrap/css/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/bootstrap/dist/css/*.map']
//				}, {
//					dest: 'script/lib/bootstrap/fonts/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/bootstrap/dist/fonts/*']
//				}, {    // font awesome
//					dest: 'style/lib/font-awesome/fonts/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/font-awesome/fonts/*']
//				}, {    // angular
//					dest: 'script/lib/angular/', expand: true, flatten: true, filter: 'isFile'
//					, src: [
//						'bower_components/angular/angular.min.js.map'
//						, 'bower_components/angular-route/angular-route.min.js.map'
//					]
//				}, {
//					dest: 'script/plugin/ZeroClipboard/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/zeroclipboard/ZeroClipboard.swf']
//				}, {
//					dest: 'script/plugin/highlight/style/', expand: true, flatten: true, filter: 'isFile'
//					, src: [
//						'bower_components/highlightjs/styles/brown_papersq.png'
//						, 'bower_components/highlightjs/styles/pojoaque.jpg'
//						, 'bower_components/highlightjs/styles/school_book.png'
//					]
//				}, {
//					dest: 'script/plugin/shine/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/shine/dist/shine.min.map']
//				}, {    // Kendo UI
//					dest: 'script/lib/kendoUI/js/', expand: true, flatten: true, filter: 'isFile'
//					, src: [
//						'bower_components/kendo-ui/js/kendo.ui.core.min.js'
//						, 'bower_components/kendo-ui/js/kendo.ui.core.min.js.map'
//					]
//				}, {
//					dest: 'script/lib/kendoUI/styles/', expand: true, flatten: true, filter: 'isFile'
//					, src: [
//						'bower_components/kendo-ui/styles/web/kendo.common.core.min.css'
//						, 'bower_components/kendo-ui/styles/web/kendo.default.min.css'
//					]
//				}, {
//					dest: 'script/lib/kendoUI/styles/default/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/kendo-ui/styles/web/Default/*']
//				}, {
//					dest: 'script/lib/kendoUI/styles/textures/', expand: true, flatten: true, filter: 'isFile'
//					, src: ['bower_components/kendo-ui/styles/web/textures/*']
//				}]
			}
		}
		, less: {
			destiny: {
				options: {
//					paths: ["assets/css"]
//					cleancss: true
				},
				files: {
					'style/style.css': 'less/style.less'
				}
			}
//			, production: {
//				options: {
//					paths: ["assets/css"],
//					cleancss: true,
//					modifyVars: {
//						imgPath: '"http://mycdn.com/path/to/images"',
//						bgColor: 'red'
//					}
//				},
//				files: {
//					"style/style.css": "less/style.less"
//				}
//			}
		}
		, htmlmin: {                                     // Task
			destiny: {                                      // Target
				options: {                                 // Target options
					removeComments: true,
					collapseWhitespace: true
				},
				files: {                                   // Dictionary of files
					'dist/index.html': 'src/index.html',     // 'destination': 'source'
					'dist/contact.html': 'src/contact.html'
				}
			}
		}
		, jsdoc: {
			destiny: {
				options: {
					destination: 'doc'
				},
				src: ['script/*/*.js', 'script/*/*/*.js']

			}
		}
	});
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.registerTask('default', [
		'concurrent'
//		,'uglify'
//		, 'copy'
//		, 'cssmin'
////		, 'htmlmin'
//		, 'less'
	]);
};