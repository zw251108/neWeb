'use strict';

var db  = require('../db.js')
	, error = require('../error.js')

	, SQL = {
		document: 'select Id,title from document'
		, documentPage: 'select Id,title from document limit :page,size'
		, documentCount: 'select count(*) as count from document'
		, documentAdd: 'insert into document(title) values(:title)'
		, documentOrder: 'update document set section_order=:order where Id=:documentId'

		, sectionByDocument: 'select Id,title from document_section where document_id=:documentId'
		, sectionById: 'select Id,title from document_section where Id=:id'
		, sectionAdd: 'insert into document_section(title,document_id) values(:title,:documentId)'
		, sectionOrder: 'update document_section set content_order=:order where Id=:sectionId'

		, contentByDocument: 'select Id,title,content,section_id,section_title from document_content where document_id=:documentId order by section_id,`order`'
		, contentBySection: 'select Id,title,content,section_title from document_content where section_id=:sectionId order by `order`'
		, contentById: 'select Id,title,content,section_title from document_content where Id=:id'
		, contentAdd: 'insert into document_content(title,content,document_id,section_id,section_title) values(:title,\'\',:documentId,:sectionId,:sectionTitle)'
		, contentSaveContent: 'update document_content set content=:content where Id=:id'
	}
	, Model = {
		getAllDoc: function(){
			return db.handle({
				sql: SQL.document
			})
		}
		, getSectionByDoc: function(documentId){
			return db.handle({
				sql: SQL.sectionByDocument
				, data: {
					documentId: documentId
				}
			});
		}
		, getContentBySec: function(sectionId){
			return db.handle({
				sql: SQL.contentBySection
				, data: {
					sectionId: sectionId
				}
			});
		}
		, getContentById: function(id){
			return db.handle({
				sql: SQL.contentById
				, data: {
					id: id
				}
			}).then(function(rs){
				return rs[0];
			}).then(function(rs){

				rs.content = rs.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;');

				return rs;
			});
		}

		, getAllContent: function(documentId){
			return db.handle({
				sql: SQL.contentByDocument
				, data: {
					documentId: documentId
				}
			}).then(function(rs){
				var document = []
					, tempTitle = ''
					, tempArray
					, t, i, j
					;

				for(i = 0, j = rs.length; i < j; i++){
					t = rs[i];

					if( t.section_title !== tempTitle ){
						tempTitle = t.section_title;
						tempArray = [];

						document.push({
							sectionTitle: tempTitle
							, sectionId: t.section_id
							, sectionList: tempArray
						});
					}

					t.content = t.content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\$/g, '&#36;');
					tempArray.push( t );
				}

				return document;
			});
		}

		, addDoc: function(data){
			return db.handle({
				sql: SQL.documentAdd
				, data: data
			});
		}
		, addSectionByDoc: function(data){
			return db.handle({
				sql: SQL.sectionAdd
				, data: data
			});
		}
		, addContentBySec: function(data){
			return db.handle({
				sql: SQL.contentAdd
				, data: data
			});
		}
		, saveContent: function(data){
			return db.handle({
				sql: SQL.contentSaveContent
				, data: data
			});
		}

		, documentSaveOrder: function(data){
			return db.handle({
				sql: SQL.documentOrder
				, data: data
			});
		}
		, sectionSaveOrder: function(data){
			return db.handle({
				sql: SQL.sectionOrder
				, data: data
			});
		}
	}
	;

module.exports = Model;