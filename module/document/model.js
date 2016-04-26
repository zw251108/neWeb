'use strict';

var db  = require('../db.js')
	, config = require('../../config.js')
	, error = require('../error.js')

	, DocumentError = require('./error.js')

	, TABLE_NAME = config.db.dataTablePrefix +'document'

	, SQL = {
		documentById: 'select title,section_order from document where id=:id'
		, documentPage: 'select id,title from document limit :page,:size'
		, documentCount: 'select count(*) as count from document'
		, documentAdd: 'insert into document(title) values(:title)'
		, documentSetOrder: 'update document set section_order=:order where id=:documentId'

		, sectionById: 'select id,title,content_order from document_section where id=:id'
		, sectionByDocument: 'select id,title,content_order from document_section where document_id=:documentId'
		, sectionAdd: 'insert into document_section(title,document_id,`order`) values(:title,:documentId,:order)'
		, sectionSetOrder: 'update document_section set content_order=:order where id=:sectionId'

		, contentById: 'select id,title,content,section_title from document_content where id=:id'
		, contentBySection: 'select id,title,content,section_title from document_content where section_id=:sectionId order by `order`'
		, contentByDocument: 'select id,title,content,section_id,section_title from document_content where document_id=:documentId order by section_id,`order`'
		, contentAdd: 'insert into document_content(title,content,document_id,section_id,section_title,`order`) values(:title,\'\',:documentId,:sectionId,:sectionTitle,:order)'
		, contentSaveContent: 'update document_content set content=:content where id=:id'
	}
	, DocumentModel = {

		getDocumentById: function(id){
			return db.handle({
				sql: SQL.documentById
				, data: {
					id: id
				}
			}).then(function(rs){
				return rs[0];
			});
		}
		, getDocumentList: function(page, size){
			return db.handle({
				sql: SQL.documentPage
				, data: {
					page: (page-1) * size
					, size: size
				}
			})
		}
		, countDocument: function(){
			return db.handle({
				sql: SQL.documentCount
			}).then(function(rs){
				var count = 0;

				if( rs && rs.length ){
					count = rs[0].count;
				}

				return count;
			});
		}
		, updateDocumentOrder: function(data){
			return db.handle({
				sql: SQL.documentSetOrder
				, data: data
			});
		}
		, addDocument: function(title){
			return db.handle({
				sql: SQL.documentAdd
				, data: {
					title: title
				}
			});
		}

		, getSectionById: function(id){
			return db.handle({
				sql: SQL.sectionById
				, data: {
					id: id
				}
			}).then(function(rs){
				return rs[0];
			});
		}
		, getSectionByDocumentId: function(documentId){
			return db.handle({
				sql: SQL.sectionByDocument
				, data: {
					documentId: documentId
				}
			});
		}
		, addSectionByDoc: function(data){
			return db.handle({
				sql: SQL.sectionAdd
				, data: data
			});
		}
		, updateSectionOrder: function(data){
			return db.handle({
				sql: SQL.sectionSetOrder
				, data: data
			});
		}

		, getContentById: function(id, encode){
			return db.handle({
				sql: SQL.contentById
				, data: {
					id: id
				}
			}).then(function(rs){
				return rs[0];
			}).then(function(rs){

				encode && rs.content && (rs.content = rs.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;'));

				return rs;
			});
		}
		, getContentBySectionId: function(sectionId, encode){
			return db.handle({
				sql: SQL.contentBySection
				, data: {
					sectionId: sectionId
				}
			}).then(function(rs){
				var t, i, j;

				if( encode ){
					for(i = 0, j = rs.length; i < j; i++){
						t = rs[i];

						t.content && (t.content = t.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;'));
					}
				}

				return rs;
			});
		}
		, getContentByDocumentId: function(documentId, encode){
			return db.handle({
				sql: SQL.contentByDocument
				, data: {
					documentId: documentId
				}
			}).then(function(rs){
				var t, i, j;

				if( encode ){
					for(i = 0, j = rs.length; i < j; i++){
						t = rs[i];

						t.content && (t.content = t.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;'));
					}
				}

				return rs;
			});
		}
		, addContentBySec: function(data){
			return db.handle({
				sql: SQL.contentAdd
				, data: data
			});
		}
		, updateContent: function(data){
			return db.handle({
				sql: SQL.contentSaveContent
				, data: data
			});
		}
	}

	, Content   = function(data){

	}
	, Section   = function(data){

	}
	, Document  = function(data){
		var k
			, t
			;

		for( k in documentData ) if( documentData.hasOwnProperty(k) ){
			if( k in data ){
				t = documentData[k];

				// todo
				if( typeof t === 'object' && Array.isArray( t ) ){
					this[k] = [];
				}
				else{
					this[k] = data[k];
				}
			}
			else{
				console.log( new DocumentError('Document Data 缺少'+ k) )
			}
		}
	}

	, documentData = {
		title: ''
		, sectionList: [Section]
	}
	, sectionData = {
		sectionId: ''
		, sectionTitle: ''
		, contentList: [Content]
	}
	, contentData = {
		id: ''
		, title: ''
		, content: ''
	}
	;

module.exports = DocumentModel;