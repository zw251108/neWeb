'use strict';

var DocumentModel   = require('./model.js')
	, DocumentError = require('./error.js')

	, Document_Default_ID = 1

	, DocumentHandler = {
		getDocumentList: function(user, query){
			var page = query.page || 1
				, size = query.size || 20
				;

			return DocumentModel.getDocumentList(page, size).then(function(rs){
				return DocumentModel.countDocument().then(function(count){
					return {
						data: rs
						, count: count
						, index: page
						, size: size
						, urlCallback: function(index){
							return '?page='+ index;
						}
					};
				});
			});
		}

		, getDefaultDocument: function(user, query){
			var documentId = query.id
				;
			query.id = documentId || Document_Default_ID;

			return DocumentHandler.getDocument(user, query);
		}
		, getDocument: function(user, query){
			var documentId = query.id
				, execute
				;

			if( documentId ){
				execute = Promise.all([DocumentModel.getDocumentById( documentId )
					, DocumentModel.getSectionByDocumentId( documentId )
					, DocumentModel.getContentByDocumentId( documentId )
				]).then( DocumentHandler.handleData );
			}
			else{
				execute = Promise.reject( new DocumentError('缺少参数 id') );
			}

			return execute;
		}
		, handleData: function(documentData){
			var document = documentData[0]
				, section = documentData[1]
				, content = documentData[2]

				, sectionIndex = {}
				, contentIndex = {}
				, sectionOrder = document.section_order.split(',')
				, contentOrder
				, i, j, t, x
				, m, n

				, result = []
				, obj
				;

			i = content.length;
			while( i-- ){
				t = content[i];

				contentIndex[t.id] = t;
			}

			i = section.length;
			while( i-- ){
				t = section[i];

				sectionIndex[t.id] = t;
			}

			for(i = 0, j = sectionOrder.length; i < j; i++ ){
				t = sectionIndex[sectionOrder[i]];

				obj = {
					sectionId: t.id
					, sectionTitle: t.title
				};

				contentOrder = t.content_order.split(',');

				t = [];
				for(m = 0, n = contentOrder.length; m < n; m++ ){
					x = contentIndex[contentOrder[m]];

					t.push( x );
				}

				obj.contentList = t;

				result.push( obj );
			}
			console.log(result)
			return {
				title: document.title
				, sectionList: result
			};
		}

		, newDocument: function(user, data){
			var title = data.title
				, execute
				;

			if( title ){
				execute = DocumentModel.addDocument( title ).then(function(rs){
					var result
						;

					if( rs.insertId ){
						result = {
							id: rs.insertId
						}
					}
					else{
						result = Promise.reject( new DocumentError(title + ' 文档创建失败') );
					}

					return result;
				});
			}
			else{
				execute = Promise.reject( new DocumentError('缺少参数 title') );
			}

			return execute;
		}
		, saveDocument: function(user, data){
			var documentId = data.documentId
				, execute
				;

			if( documentId ){
				execute = DocumentModel.updateDocumentOrder( data ).then(function(rs){
					return {
						id: documentId
					};
				});
			}
			else{
				execute = Promise.reject( new DocumentError('缺少参数 documentId') );
			}

			return execute;
		}

		, newSection: function(user, data){
			var documentId = data.documentId
				, title = data.title
				, execute
				;

			if( documentId && title ){
				execute = DocumentModel.addSectionByDoc( data).then(function(rs){
					var result
						;

					if( rs.insertId ){
						result = {
							id: rs.insertId
						};
					}
					else{
						result = Promise.reject( new DocumentError(title +' 章创建失败') );
					}

					return result;
				});
			}
			else{
				execute = Promise.reject( new DocumentError('缺少参数 documentId || title') );
			}

			return execute;
		}
		, saveSection: function(user, data){
			var documentId = data.documentId
				, sectionId = data.sectionId
				, execute
				;

			if( documentId && sectionId ){
				execute = DocumentModel.updateSectionOrder( data ).then(function(rs){
					return {
						documentId: documentId
						, sectionId: sectionId
					};
				});
			}
			else{
				execute = Promise.reject( new DocumentError('缺少参数 documentId || sectionId') );
			}

			return execute;
		}

		, newContent: function(user, data){
			var documentId = data.documentId
				, sectionId = data.sectionId
				, title = data.title
				, execute
				;

			if( documentId && sectionId && title ){
				execute = DocumentModel.addContentBySec( data ).then(function(rs){
					var result
						;

					if( rs.insertId ){
						result = {
							id: rs.insertId
						};
					}
					else{
						result = Promise.reject( new DocumentError(title +'节创建失败') );
					}

					return result;
				});
			}
			else{
				execute = Promise.reject( new DocumentError('缺少参数 documentId || sectionId || title') );
			}

			return execute;
		}
		, saveContent: function(user, data){
			var documentId = data.documentId
				, sectionId = data.sectionId
				, contentId = data.contentId
				, execute
				;

			// 过滤 style script iframe frameset frame 标签
			data.content = data.content.replace(/<(style|script|iframe|frameset)([^>]*)>(.*?)<\/\1>/g, '&lt;$1$2&gt;$3&lt;/$1&gt;').replace(/<frame([^>]*)\/>/g, '&lt;frame$1/&gt;');

			if( documentId && sectionId && contentId ){
				execute = DocumentModel.updateContent( data ).then(function(rs){
					return {
						documentId: documentId
						, sectionId: sectionId
						, contentId: contentId
					};
				})
			}
			else{
				execute = Promise.reject( new DocumentError('缺少参数 documentId || sectionId || contentId') );
			}

			return execute;
		}
	}
	;

module.exports = DocumentHandler;