'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')
	, popup     = require('../emmet/popup.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')
	, menu      = require('../menu.js')
	, pagination    = require('../pagination.js')

	, TagView   = require('../tag/view.js')

	, readerTpl    = emmetTpl({
		template: 'section#reader_%id%.reader_section.section' +
			'>a[href=%html_url% data-feed=%xml_url% data-id=%id%]' +
				'>h3.section_title{%name%}' +
					'>i.icon.icon-up' +
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
		template: 'article#readerArt%id%.reader_article.article[data-id=%id% data-bookmark-id=%bookmarkId% data-status=%status% data-score=%score%]' +
			'>a[href=%url% title=%title% target=_blank]' +
				'>h3.article_title{%title%}' +
			'^hr' +
			'+a.icon.icon-checkbox%readStatus%[href=./read title=%readTitle%]{%readText%}' +
			'+time.article_date[pubdate=pubdate datetime=%datetime%]{%datetime%}' +
			'+div.tagsArea{%tags%}'
		, filter: {
			title: function(d){
				return d.title || d.url;
			}
			, readStatus: function(d){
				return +d.status > 0 ? '-checked' : '';
			}
			, readTitle: function(d){
				return +d.status > 0 ? '已读' : '读过';
			}
			, readText: function(d){
				return +d.status > 0 ? '已读' : '读过';
			}
			, tags: function(d){
				return d.tags ? '<span class="tag'+ (d.status > 0 ? ' tag-checked' : '') +'">'+ d.tags.split(',').join('</span><span class="tag'+ (d.status > 0 ? ' tag-checked' : '') +'">') +'</span>' : '';
			}
		}
	})
	, feedAddFormTpl        = emmetTpl({
		template: 'form' +
			'>div.formGroup' +
				'>label.label[for=name]{请输入网站名称}' +
				'+input#name.input[type=text name=name placeholder=请输入网站名称 data-validator=name]' +
			'^div.formGroup' +
				'>label.label[for=url]{请输入网站链接}' +
				'+input#url.input[type=text name=url placeholder=请输入网站链接 data-validator=url]' +
			'^div.formGroup' +
				'>label.label[for=xml]{请输入订阅链接}' +
				'+input#feed.input[type=text name=feed placeholder=请输入订阅链接 data-validator=feed]'
	})
	, bookmarkAddFormTpl    = emmetTpl({
		template: 'form' +
			'>div.formGroup' +
				'>label.label[for=url]{请输入链接}' +
				'+input#url.input[type=text placeholder=请输入链接 data-validator=url]'
	})
	, bookmarkReadFormTpl   = emmetTpl({
		template: 'form#readForm' +
			'>input#ubId[type=hidden name=id]' +
			'+input#bookmarkId[type=hidden name=bookmarkId]' +
			'+input#bookmarkUrl[type=hidden name=bookmarkUrl]' +
			'+input#oldScore[type=hidden name=oldScore value=%score%]' +
			'+input#oldStatus[type=hidden name=oldStatus value=%status%]' +
			'+div.formGroup' +
				'>label.label[for=bookmarkTitle]{请设置标题}' +
				'+input#bookmarkTitle.input[type=text name=title placeholder=重新设置标题 data-validator=title]' +
			'^div.formGroup' +
				'>label.label[for=star1]{请评分}' +
				'+div.input.input-score' +
					'>span.scoreList' +
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
					'^^span.scoreValue' +
			'^' + TagView.tagEditorEmmet
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
							type: 'link', id: 'favorite', icon: 'star', title: '收藏文章', href: 'favorite'}, {
							type: 'button', id: 'add', icon: 'plus', title: '添加订阅源'}, {
							type: 'button', id: 'filter', icon: 'filter', title: '过滤'}, {
							type: 'button', id: 'search', icon: 'search', title: '搜索'
						}]
						, content: readerTpl( rs.data ).join('') + '<div id="pagination" class="pagination">'+ pagination(rs.index, rs.size, rs.count, rs.urlCallback) + '</div>'
					}
					, modulePopup: [popup.msgPopup, {
						id: 'readPopup'
						, size: 'normal'
						, content: bookmarkReadFormTpl({})
						, button: '<button type="button" id="readBookmark" class="btn btn-submit">确定</button>'
					}, {
						id: 'addPopup', size: 'normal'
						, content: feedAddFormTpl({})
						, button: '<button type="button" id="addFeed" class="btn btn-submit">确定</button>'
					}]
				}
				, footer: {
					nav: menu.current('reader')
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
							type: 'link', id: 'rss', icon: 'rss', title: '订阅列表', href: '/reader/'}, {
							type: 'link', id: 'favorite', icon: 'star', title: '收藏文章', href: 'favorite'}, {
							type: 'button', id: 'add', icon: 'plus', title: '添加订阅源'}, {
							type: 'button', id: 'filter', icon: 'filter', title: '过滤'}, {
							type: 'button', id: 'search', icon: 'search', title: '搜索'
						}]
						, content: articleTpl( rs.data ).join('') + '<div class="pagination" id="pagination">' + pagination(rs.index, rs.size, rs.count, rs.urlCallback) + '</div>'
					}
					, modulePopup: [popup.msgPopup, {
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
				, footer: {
					nav: menu.current('bookmark')
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
						, icon: 'star'
						, title: '收藏文章 favorite'
						, toolbar: [{
							type: 'link', id: 'rss', icon: 'rss', title: '订阅列表', href: '/reader/'}, {
							type: 'link', id: 'bookmark', icon: 'bookmark', title: '待读文章', href: 'bookmark'}, {
							type: 'button', id: 'filter', icon: 'filter', title: '过滤'}, {
							type: 'button', id: 'search', icon: 'search', title: '搜索'
						}]
						, content: articleTpl( rs.data ).join('') + '<div class="pagination" id="pagination">' + pagination(rs.index, rs.size, rs.count, rs.urlCallback) + '</div>'
					}
					, modulePopup: [{
						id: 'readPopup'
						, size: 'normal'
						, content: bookmarkReadFormTpl({})
						, button: '<button type="button" id="readBookmark" class="btn btn-submit">确定</button>'
					}]
				}
				, footer: {
					nav: menu.current('favorite')
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