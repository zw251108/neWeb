/**
 * @module code
 * */
require.config({
	baseUrl: '../script/'
	, paths: {
		jquery: 'lib/jquery.min'
		, global: 'module/global'
		, socket: 'module/socket'
		, template: 'ui/jquery.emmetTpl'
	}
});
require(['jquery', 'global', 'socket'
	, 'plugin/codeMirror/lib/codemirror'
	, 'plugin/codeMirror/emmet/emmet.min'
	, 'plugin/codeMirror/mode/xml/xml'
	, 'plugin/codeMirror/mode/htmlmixed/htmlmixed'
	, 'plugin/codeMirror/mode/javascript/javascript'
	, 'plugin/codeMirror/mode/css/css'
	, 'plugin/codeMirror/addon/comment/comment'
	, 'plugin/codeMirror/addon/comment/continuecomment'
	, 'plugin/codeMirror/addon/fold/foldcode'
	, 'plugin/codeMirror/addon/fold/foldgutter'
	, 'plugin/codeMirror/addon/fold/brace-fold'
	, 'plugin/codeMirror/addon/fold/xml-fold'
	, 'template'
], function($, g, socket, cm){
	var cmArr = []
		, $editor = $('#editor').find('textarea').each(function(){
			var mode = this.className;

			if( mode.indexOf('code-html') > -1 ){
				mode = 'text/html';
			}
			else if( mode.indexOf('code-css') > -1 ){
				mode = 'text/css';
			}
			else if( mode.indexOf('code-js') > -1 ){
				mode = 'javascript';
			}
			cmArr.push( cm.fromTextArea(this, {
				mode: mode
				, lineNumbers : true
				, foldGutter: true
				, gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter']
				, matchBrackets: true
				//, readOnly: true
			}) );
		})
		;

	var skinTpl = $.template({
		template: 'option[value=%name%]{%name%}'
	})
	, $skinLink = $('<link />', {
		rel: 'stylesheet'
	}).appendTo('head')
	, $skin = $('<select />').css({
		position: 'absolute'
		, top: 0
		, left: 0
	}).append(skinTpl([{
		name: 'default'}, {
		name: '3024-day'}, {
		name: '3024-night'}, {
		name: 'ambiance'}, {
		name: 'ambiance-mobile'}, {
		name: 'base16-dark'}, {
		name: 'base16-light'}, {
		name: 'blackboard'}, {
		name: 'cobalt'}, {
		name: 'eclipse'}, {
		name: 'elegant'}, {
		name: 'erlang-dark'}, {
		name: 'lesser-dark'}, {
		name: 'mbo'}, {
		name: 'mdn-like'}, {
		name: 'midnight'}, {
		name: 'monokai'}, {
		name: 'neat'}, {
		name: 'neo'}, {
		name: 'night'}, {
		name: 'paraiso-dark'}, {
		name: 'paraiso-light'}, {
		name: 'pastel-on-dark'}, {
		name: 'rubyblue'}, {
		name: 'solarized'}, {
		name: 'the-matrix'}, {
		name: 'tomorrow-night-bright'}, {
		name: 'tomorrow-night-eighties'}, {
		name: 'twilight'}, {
		name: 'vibrant-ink'}, {
		name: 'xq-dark'}, {
		name: 'xq-light'}, {
		name: 'zenburn'
	}]).join('')).appendTo('#editor').on('change', function(){
		var skin = this.value;
		if( skin === 'default' ){
			$skinLink.attr('src', '');
		}
		else{
			$skinLink.attr('href', '../script/plugin/codeMirror/theme/'+ skin +'.css');
		}
		cmArr.forEach(function(d){
			d.setOption('theme', skin);
		});
	});
});