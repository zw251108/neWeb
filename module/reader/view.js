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
		template: getEmmet('reader/reader.html')
		, filter: {
			tags: function(d){
				return d.tags ? '<span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">'+ d.tags.split(',').join('</span><span class="tag'+ (d.status > 1 ? ' tag-checked' : '') +'">') +'</span>' : '';
			}
		}
	})
	, readerAddFormTpl        = emmetTpl({
		template: getEmmet('reader/readerAddForm.html')
	})


	, bookmarkArticleTpl   = emmetTpl({
		template: getEmmet('reader/bookmarkArticle.html')
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
	, bookmarkAddFormTpl    = emmetTpl({
		template: getEmmet('reader/bookmarkAddForm.html')
	})
	, bookmarkReadFormTpl   = emmetTpl({
		template: getEmmet('reader/bookmarkReadForm.html') +
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
						, content: readerAddFormTpl({})
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
						, content: bookmarkArticleTpl( rs.data ).join('') + '<div class="pagination" id="pagination">' + pagination(rs.index, rs.size, rs.count, rs.urlCallback) + '</div>'
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
						, content: bookmarkArticleTpl( rs.data ).join('') + '<div class="pagination" id="pagination">' + pagination(rs.index, rs.size, rs.count, rs.urlCallback) + '</div>'
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