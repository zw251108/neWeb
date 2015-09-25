'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, pagination    = require('../pagination.js')
	, footer    = require('../footer.js')

	, TagView   = require('../tag/view.js')

	, readerTpl    = emmetTpl({
		template: 'section#reader_%Id%.reader_section.section' +
			'>a[href=%html_url% data-feed=%xml_url% data-id=%Id%]' +
				'>h3.section_title{%name%}' +
					'>span.icon.icon-up' +
				'^^hr' +
				'+ul.reader_articleList' +
				'+div.tagsArea{%tags%}'
		, filter: {
			tags: function(d){
				return d.tags ? '<span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">'+ d.tags.split(',').join('</span><span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">') +'</span>' : '';
			}
		}
	})
	, articleTpl   = emmetTpl({
		template: 'article#readerArt%Id%.reader_article.article[data-id=%Id% data-score=%score%]' +
			'>a[href=%url% title=%title% target=_blank]' +
				'>h3.article_title{%title%}' +
			'^hr' +
			'+a.icon.icon-checkbox%readStatus%[href=reader/read title=%readTitle%]{%readText%}' +
			'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}' +
			'+div.tagsArea{%tags%}'
		, filter: {
			title: function(d){
				return d.title || d.url;
			}
			, readStatus: function(d){
				return +d.status > 1 ? '-checked' : '';
			}
			, readTitle: function(d){
				return +d.status > 1 ? '已读' : '未读';
			}
			, readText: function(d){
				return +d.status > 1 ? '已读过' : '读过';
			}
			, tags: function(d){
				return d.tags ? '<span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">'+ d.tags.split(',').join('</span><span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">') +'</span>' : '';
			}
		}
	})
	, bookmarkAddFormTpl    = emmetTpl({
		template: 'form' +
			'>div.formGroup' +
				'>label.label[for=url]{请输入链接}' +
				'+input#url.input[type=text placeholder=请输入链接 data-validator=url]'
	})
	, bookmarkReadFormTpl   = emmetTpl({
		template: 'form#readForm' +
			'>input#bookmarkId[type=hidden name=bookmarkId]' +
				'+input#bookmarkUrl[type=hidden name=bookmarkUrl]' +
				'+div.formGroup' +
					'>label.label[for=bookmarkTitle]{请设置标题}' +
					'+input#bookmarkTitle.input[type=text name=title placeholder="重新设置标题" data-validator=title]' +
				'^div.formGroup' +
					'>label.label[for=star1]{请评分}' +
					'+div.input-score' +
						'>input#star5[type=radio name=score value=5]' +
						'+label.icon.icon-star[for=star5]' +
						'+input#star4[type=radio name=score value=4]' +
						'+label.icon.icon-star[for=star4]' +
						'+input#star3[type=radio name=score value=3]' +
						'+label.icon.icon-star[for=star3]' +
						'+input#star2[type=radio name=score value=2]' +
						'+label.icon.icon-star[for=star2]' +
						'+input#star1[type=radio name=score value=1]' +
						'+label.icon.icon-star[for=star1]' +
				'^^' + TagView.tagEditorEmmet
	})

	, View = {
		readerList: function(rs){
			return tpl({
				title: '阅读 reader'
				, main: {
					moduleMain: {
						id: 'reader'
						, title: '阅读 reader'
						, toolbar: [{
							type: 'link', id: 'bookmark', icon: 'bookmark', title: '待读文章', href: 'bookmark'}, {
							type: 'link', id: 'favorite', icon: 'favorite', title: '收藏文章', href: 'favorite'}, {
							type: 'button', id: 'add', icon: 'plus', title: '添加订阅源'}, {
							type: 'button', id: 'filter', icon: 'filter', title: '过滤'}, {
							type: 'button', id: 'search', icon: 'search', title: '搜索'
						}]
						, content: readerTpl( rs.data ).join('') + '<div id="pagination" class="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) + '</div>'
					}
					, modulePopup: [{
						id: 'msgPopup'
						, size: 'small'
						, content: '<div class="msg" id="msgContent"></div>'
					}, {
						id: 'readPopup'
						, size: 'normal'
						, content: bookmarkReadFormTpl({})
						, button: '<button type="button" id="readBookmark" class="btn btn-submit">确定</button>'
					}]
				}
				, script: {
					main: '../script/module/reader/index'
					, src: '../script/lib/require.min.js'
				}
			});
		}
		, bookmarkList: function(rs){
			return tpl({
				title: '书签 bookmark'
				, main: {
					moduleMain: {
						id: 'bookmark'
						, title: '书签 bookmark'
						, toolbar: [{
							type: 'link', id: 'rss', icon: 'rss', title: '订阅列表', href: '/'}, {
							type: 'link', id: 'favorite', icon: 'favorite', title: '收藏文章', href: 'favorite'}, {
							type: 'button', id: 'add', icon: 'plus', title: '添加订阅源'}, {
							type: 'button', id: 'filter', icon: 'filter', title: '过滤'}, {
							type: 'button', id: 'search', icon: 'search', title: '搜索'
						}]
						, content: articleTpl( rs.data ).join('') + '<div class="pagination" id="pagination">' + pagination(rs.index, rs.size, rs.count, rs.urlCallback) + '</div>'
					}
					, modulePopup: [{
						id: 'msgPopup'
						, size: 'small'
						, content: '<div class="msg" id="msgContent"></div>'
					}, {
						id: 'readPopup'
						, size: 'normal'
						, content: bookmarkReadFormTpl({})
						, button: '<button type="button" id="readBookmark" class="btn btn-submit">确定</button>'
					}, {
						id: 'addPopup'
						, size: 'normal'
						, content: bookmarkAddFormTpl({})
						, button: '<button type="button" id="addBookmark" class="btn btn-submit">确定</button>'
					}]
				}
				, script: {
					main: '../script/module/reader/bookmark'
					, src: '../script/lib/require.min.js'
				}
			})
		}
		, favoriteList: function(rs){
			return tpl({
				title: '收藏文章 favorite'
				, main: {
					moduleMain: {
						id: 'favorite'
						, title: '收藏文章 favorite'
						, toolbar: [{
							type: 'link', id: 'rss', icon: 'rss', title: '订阅列表', href: '/'}, {
							type: 'link', id: 'bookmark', icon: 'bookmark', title: '待读文章', href: 'bookmark'}, {
							type: 'button', id: 'filter', icon: 'filter', title: '过滤'}, {
							type: 'button', id: 'search', icon: 'search', title: '搜索'
						}]
						, content: articleTpl( rs.data ).join('') + '<div class="pagination" id="pagination">' + pagination(rs.index, rs.size, rs.count, rs.urlCallback) + '</div>'
					}
					, modulePopup: [{
						id: 'readPopup'
						, size: normal
						, content: bookmarkReadFormTpl({})
						, button: '<button type="button" id="readBookmark" class="btn btn-submit">确定</button>'
					}]
				}
				, script: {
					main: '../script/module/reader/favorite'
					, src: '../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = View;