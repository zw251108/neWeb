'use strict';

var db  = require('../db.js')
	, error = require('../error.js')

	, SQL = {
		document: 'select title,content,section_title from document order by section_id,`order`'
		, documentSection: 'select title,content,section_title from document where section_id=:sectionId order by `order`'
	}
	, Model = {
		getAll: function(){
			return db.handle({
				sql: SQL.document
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
							, sectionList: tempArray
						});
					}

					tempArray.push( t );
				}

				return document;
			});
		}
	}
	;

module.exports = Model;