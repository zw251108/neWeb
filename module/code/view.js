'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')
	, popup     = require('../emmet/popup.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')
	, menu      = require('../menu.js')
	, pagination    = require('../pagination.js')

	, TagView   = require('../tag/view.js')

	, PREVIEW_SIZE = 128

	, codeTpl = emmetTpl({
		template: getEmmet('code/code.html')
		, filter: {
			width: function(d){
				var w = d.width
					, h = d.height
					, rs
					;
				if( w <= PREVIEW_SIZE && h <= PREVIEW_SIZE ){
					rs = w;
				}
				else if( w >= h ){
					rs = PREVIEW_SIZE;
				}
				else{
					rs = Math.floor( PREVIEW_SIZE/h * w );
				}

				return rs;
			}
			, height: function(d){
				var w = d.width
					, h = d.height
					, rs
					;
				if( w <= PREVIEW_SIZE && h <= PREVIEW_SIZE ){
					rs = h;
				}
				else if( h >= w ){
					rs = PREVIEW_SIZE;
				}
				else{
					rs = Math.floor( PREVIEW_SIZE/w * h );
				}

				return rs;
			}
			,alt: function(data){
				return data.preview ? data.name : '没有预览图片';
			}
			, tags: TagView.tagEditorFilter.tagsArea
		}
	})
	, codeEditTpl = emmetTpl({
		template: getEmmet('code/codeEdit.html')
	})
	, demoImgUploadFormTpl = emmetTpl({
		template: getEmmet('code/demoImgUploadForm.html')
	})
	, codeSetMoreFormTpl = emmetTpl({
		template: 'form#setMoreForm[method=post action=%setMore% target=editorSetMoreRs enctype=multipart/form-data]' +
				'>input#codeId[type=hidden name=id value=%id%]' +
				'+div.formGroup' +
					'>label.label[for=codeName]{请输入名称}' +
					'+input#codeName.input[type=text name=name value=%name% placeholder=请输入名称 data-validator=title]' +
				'^div.formGroup' +
					'>div#editorPreview.editor_preview' +
						'>img[src=%preview% width=%width% height=%height% alt=%name%]' +
					'^label.label[for=preview]{请添加预览图片}' +
					'+input[type=hidden name=type value=preview]' +
					'+input#preview.input[type=file name=preview]' +
				'^%tagEditor%^^fieldset' +
					'>legend' +
						'>label' +
							'>input[type=checkbox name=setUI value=1]' +
							'+span#setM{更多设置}' +
					'^^div.group.hidden' +
						'>input[type=hidden name=setUI value=1]' +
						'+div.formGroup' +
							'>input#uiName.input[type=text name=uiName placeholder=请设置&nbsp;UI&nbsp;组件名称 data-validator=uiName]' +
							'+label.label[for=uiName]{请设置 UI 组件名称}' +
						'^div.formGroup' +
							'>input#uiNam2.input[type=text name=uiName placeholder=请设置&nbsp;UI&nbsp;组件名称 data-validator=uiName]' +
							'+label.label[for=uiNam2]{请设置 UI 组件名称}' +
			'^^^iframe#editorSetMoreRs.hidden[name=editorSetMoreRs]'
		, filter: TagView.tagEditorFilter
		// template: getEmmet('code/codeSetMoreForm.html')
		// , filter: {
		// 	tagEditor: function(d){console.log(d, TagView.tagEditorTpl(d).join(''))
		// 		return TagView.tagEditorTpl(d).join('');
		// 	}
		// }
	})

	, CodeView = {
		codeList: function(rs){
			return tpl({
				title: '代码库 code'
				, main: {
					moduleMain: {
						id: 'code'
						, icon: 'code'
						, title: '代码库 code'
						, toolbar: [{
							type: 'link',   id: 'newCode',  icon: 'file-code',  title: '新建代码', href: 'code?id=0'}, {
							type: 'button', id: 'filter',   icon: 'filter',     title: '过滤'}, {
							type: 'button', id: 'search',   icon: 'search',     title: '搜索'
						}]
						, content: codeTpl( rs.data ).join('')
					}
				}
				, footer: {
					nav: menu.current('code')
				}
				, script: {
					main: '../script/module/code/index'
					, src: '../script/lib/require.min.js'
				}
			});
		}
		, editor: function(rs){
			return tpl({
				title: '编辑器 editor'
				, main: {
					moduleMain: {
						id: 'editor'
						, title: '编辑器 editor'
						, toolbar: [{
							type: 'button', id: 'changeLayout', icon: 'layout', title: '更改布局'}, {
							type: 'button', id: 'changeSkin',   icon: 'skin',   title: '更改皮肤'}, {
							type: 'button', id: 'getDemoImg',   icon: 'picture',    title: '素材'}, {
							type: 'button', id: 'getUiLib',     icon: 'lib',    title: '引用组件'}, {
							type: 'button', id: 'newWin',       icon: 'window', title: '在新窗口浏览'}, {
							type: 'button', id: 'set',          icon: 'settle', title: '更多设置'
						}]
						, content: codeEditTpl( rs ).join('')
					}
					, modulePopup: [popup.msgPopup, {
						id: 'setMore'
						, size: 'normal'
						, toolbar: ''
						, content: codeSetMoreFormTpl(rs)
						, button: '<button type="button" id="codeSave" class="btn btn-submit">保存</button>'
					}, {
						id: 'uiLib'
						, size: 'normal'
						, toolbar: ''
						, content: '<dl class="list-tree" id="uiLibList" role="tree"></dl>'
						, button: '<button type="button" id="sure" class="btn btn-submit">确定</button>'
					}, {
						id: 'demoImgLib'
						, size: 'large'
						, toolbar: ''
						, content: demoImgUploadFormTpl(rs)
					}]
				}
				, footer: {
					nav: menu.current('code')
				}
				, script: {
					main: '../script/module/code/editor'
					, src: '../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = CodeView;