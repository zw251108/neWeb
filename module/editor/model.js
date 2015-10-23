'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, EditorError = require('./error.js')

	, SQL = {
		editor: 'select editor.Id,editor.name,preview,tags,width,height from editor,image' +
			' where' +
			' status=1 and' +
			' editor.preview=image.src order by editor.Id'

		, editorPage: 'select editor.Id,editor.name,preview,tags,width,height from editor,image' +
			' where' +
			' status=1 and' +
			' editor.preview=image.src order by editor.Id limit :page,:size'
		, editorCount: 'select count(*) as count from editor' +
			' where status=1'
		, editorSearchName: 'select editor.Id,editor.name,preview,tags,width,height from editor,image' +
			' where editor.name like :keyword' +
			' and status=1' +
			' and editor.preview=image.src order by editor.Id limit :page,:size'
		, editorSearchNameCount: 'select count(*) as count from editor' +
			' where name like :keyword' +
			' and status=1'

		, codeById: 'select editor.Id,editor.name,tags,css_lib,js_lib,html,css,js,preview,width,height from editor,image where editor.Id=:id and editor.preview=image.src'
		, codeByName: 'select Id,name,tags,css_lib,js_lib,html,css,js from editor where name=:name'

		, codeAdd: 'insert into editor(status,html,css,js,css_lib,js_lib,name,preview,create_time) values(1,:html,:css,:js,:cssLib,:jsLib,:name,\'../image/default/no-pic.png\',now())'
		, codeUpdate: 'update editor set name=:name,html=:html,css=:css,js=:js,css_lib=:cssLib,js_lib=:jsLib where Id=:id'
		// todo 设置 UI 组件
		, codeSetMore: 'update editor set name=:name,tags=:tags where Id=:id'
		, codeSetMoreImg: 'update editor set name=:name,tags=:tags,preview=:preview where Id=:id'
	}
	, Model = {
		getEditorAll: function(){
			return db.handle({
				sql: SQL.editor
			});
		}
		, getEditorByPage: function(page, size){
			return db.handle({
				sql: SQL.editorPage
				, data: {
					page: (page -1) * size
					, size: size
				}
			});
		}
		, getEditorById: function(id){
			var rs;

			if( id ){
				rs = db.handle({
					sql: SQL.codeById
					, data: {
						id: id
					}
				}).then(function(rs){
					rs = rs[0];
					rs.html = rs.html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;');
					rs.css = rs.css.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;');
					rs.js = rs.js.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;');

					return rs;
				});
			}
			else{
				rs = Promise.reject( new EditorError('缺少 id') );
			}

			return rs;
		}

		, countEditor: function(){
			return db.handle({
				sql: SQL.editorCount
			}).then(function(rs){
				var count = 0;
				if( rs && rs.length ){
					count = rs[0].count
				}

				return count;
			});
		}

		, searchEditorByName: function(keyword, page, size){
			return db.handle({
				sql: SQL.editorSearchName
				, data: {
					keyword: '%'+ keyword +'%'
					, page: (page -1) * size
					, size: size
				}
			});
		}
		, countSearchEditorByName: function(keyword){
			return db.handle({
				sql: SQL.editorSearchNameCount
				, data: {
					keyword: '%'+ keyword + '%'
				}
			}).then(function(rs){
				var result
					;

				if( rs && rs.length ){
					result = +rs[0].count;
				}
				else{
					result = 0
				}

				return result;
			})
		}

		, addEditor: function(data){
			return db.handle({
				sql: SQL.codeAdd
				, data: data
			});
		}

		, updateEditor: function(data){
			return db.handle({
				sql: SQL.codeUpdate
				, data: data
			});
		}
		, updateEditorSet: function(data){
			return db.handle({
				sql: SQL.codeSetMore
				, data: data
			});
		}
		, updateEditorSetImg: function(data){
			return db.handle({
				sql: SQL.codeSetMoreImg
				, data: data
			});
		}

		//, editorByPage: function(page, size){
		//	page = page || 1;
		//	size = size || 20;
		//
		//	return db.handle({
		//		sql: SQL.editorPage
		//		, data: {
		//			page: (page -1) * size
		//			, size: size
		//		}
		//	});
		//}
		//, editorCount: function(){
		//	return db.handle({
		//		sql: SQL.editorCount
		//	});
		//}
		//, codeById: function(id){
		//	var rs;
		//
		//	if( id ){
		//		rs = db.handle({
		//			sql: SQL.codeById
		//			, data: {
		//				id: id
		//			}
		//		}).then(function(rs){
		//			return rs[0];
		//		});
		//	}
		//	else{
		//		rs = Promise.resolve({});
		//	}
		//
		//	return rs;
		//}
		//, codeByName: function(name){
		//	var rs;
		//
		//	if( name ){
		//		rs = db.handle({
		//			sql: SQL.codeByName
		//			, data: {
		//				name: name
		//			}
		//		}).then(function(rs){
		//			return rs[0];
		//		});
		//	}
		//	else{
		//		rs = Promise.resolve({});
		//	}
		//
		//	return rs;
		//}
		//, codeSave: function( code ){
		//	return db.handle({
		//		sql: SQL.codeSave
		//		, data: code
		//	});
		//}
		//, codeUpdate: function( code ){
		//	return db.handle({
		//		sql: SQL.codeUpdate
		//		, data: code
		//	});
		//}
		//, codeSetMore: function(settle){
		//	return db.handle({
		//		sql: SQL.codeSetMore
		//		, data: settle
		//	});
		//}
	}
	;

module.exports = Model;