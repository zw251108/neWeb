'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, EditorError = require('./error.js')

	, SQL = {
		editor: 'select editor.Id,editor.name,preview,tags,width,height from editor,image where status=1 and editor.preview=image.src order by editor.Id'

		, editorCount: 'select count(*) as count from editor where status=1'
		, editorPage: 'select editor.Id,editor.name,preview,tags,width,height from editor,image where status=1 and editor.preview=image.src order by editor.Id limit :page,:size'

		, codeById: 'select Id,name,tags,css_lib,js_lib,html,css,js from editor where Id=:id'
		, codeByName: 'select Id,name,tags,css_lib,js_lib,html,css,js from editor where name=:name'

		, codeAdd: 'insert into editor(status,html,css,js,css_lib,js_lib,name,preview,create_time) values(1,:html,:css,:js,:cssLib,:jsLib,:name,\'../image/default/no-pic.png\',now())'
		, codeUpdate: 'update editor set name=:name,html=:html,css=:css,js=:js,css_lib=:cssLib,js_lib=:jsLib where Id=:id'
		, codeSetMore: 'update editor set name=:name,tags=:tags,preview=:preview where Id=:id'
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
					return rs[0];
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