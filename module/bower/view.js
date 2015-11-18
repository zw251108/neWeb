'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')
	, pagination    = require('../pagination.js')

	, bowerListWrapTpl = emmetTpl({
		template: 'div.wrap' +
			'>table.lib_table' +
				'>thead' +
					'>tr' +
						'>th{组件名称}' +
						'+th{版本}' +
						'+th{CSS 文件路径}' +
						'+th{JS 文件路径}' +
						'+th{demo 页面}' +
						'+th{组件来源}' +
						'+th{组件主页}' +
						'+th{标签}' +
						'+th{收录时间}' +
				'^^tbody{%bowerList%}' +
			'^^div#pagination.pagination{%pagination%}'
	})
	, bowerListTpl  = emmetTpl({
		template: 'tr' +
			'>td{%name%}' +
			'+td{%version%}' +
			'+td{%css_path%}' +
			'+td{%js_path%}' +
			'+td' +
				'>a[href=%demo_path% target=_blank]{%demo_path%}' +
			'^td{%source%}' +
			'+td{%homepage%}' +
			'+td{%tags_html%}' +
			'+td{%receipt_time%}'
		, filter: {
			css_path: function(d){
				return d.css_path ? d.css_path.split(',').map(function(d){
					return '<p>'+ d +'</p>';
				}).join('') : '';
			}
			, js_path: function(d){
				return d.js_path ? d.js_path.split(',').map(function(d){
					return '<p>'+ d +'</p>';
				}).join('') : '';
			}
		}
	})
	, bowerSearchFormTpl = emmetTpl({
		template: 'form#bowerSearch[action=#]' +
			'>div.formGroup' +
				'>input.input[type=text]' +
				'+button.btn.icon.icon-search[type=submit]{搜索}' +
		'^^div.bower_resultList' +
			'>table' +
				'>thead' +
					'>tr' +
						'>th{组件名称}' +
						'+th{组件来源}' +
						'+th' +
				'^^tbody'
	})

	, View = {
		bowerList: function(rs){
			return tpl({
				title: '组件 bower'
				, main: {
					moduleMain: {
						id: 'bower'
						, title: '组件 bower'
						, toolbar: [{
							type: 'button', id: 'switch_dialog', icon: 'search', title: '搜索组件'
						}]
						, content: bowerListWrapTpl({
							bowerList: bowerListTpl( rs.data ).join('')
							, pagination: pagination(rs.index, rs.size, rs.count, rs.urlCallback)
						})
					}
					, modulePopup: [{
						id: 'result'
						, size: 'large'
						, toolbar: ''
						, content: bowerSearchFormTpl({})
					}, {
						id: 'info'
						, size: 'large'
						, toolbar: ''
						, content: '<ul id="infoList"></ul>'
					}]
				}
				, footer: {
					nav: modules.current('bower')
				}
				, script: {
					main: '../script/bower'
					, src: '../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = View;