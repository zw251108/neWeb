'use strict';

var Document = {
		index: {
			sql: 'select title,content,section_title from document order by section_id,`order`'
			, handler: function(data){
				var document = []
					, tempTitle = ''
					, tempArray
					, i, j
					;

				for(i = 0, j = data.length; i < j; i++){
					if( data[i].section_title !== tempTitle ){
						tempTitle = data[i].section_title;
						tempArray = [];
						document.push({
							section_title: tempTitle
							, dl: tempArray
						});
					}

					tempArray.push( data[i] );
				}
				return document;
			}
		}
	}

	, tpl           = require('./emmetTpl/tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, dlTpl         = emmetTpl({
		template: 'dt.icon.icon-right{%title%}+dd{%content%}'
	})
	, sectionTpl    = emmetTpl({
		template: 'section.document_section.section>h3.section_title{%section_title%}>span.icon.icon-minus^dl{%dl%}'
		, filter: {
			dl: function(d){
				return dlTpl(d.dl).join('');
			}
		}
	})
	;

module.exports = function(web, db, socket, metro){
	var document = Document;

	metro.push({
		id: 'document'
		, type: 'metro'
		, size: 'small'
		, title: '前端文档 document'
	});

	web.get('/document/', function(req, res){
		var index = document.index
			;

		db.query(index.sql, function(e, rs){
			if( !e ){
				rs = index.handler( rs );

				res.send(tpl.html('module', {
					title: '前端文档 Document'
					, modules: tpl.mainTpl({
						id: 'document'
						, size: 'large'
						, title: '前端文档 document'
						, content: sectionTpl(rs).join('')
					}).join('')
					, script: {
						main: '../script/module/document/index'
						, src: '../script/lib/require.min.js'
					}
				}) );
			}
			else{
				console.log('\n', 'DB', '\n', index.sql, '\n', e.message);
			}
			res.end();
		});
	});

	socket.register({
		document: function(socket){
			var index = document.index;
		    db.query(index.sql, function(e, rs){
			    if( !e ){
				    rs = index.handler( rs );

				    socket.emit('getData', {
					    topic: 'document'
					    , data: rs
				    });
			    }
			    else{
				    socket.emit('getData', {
					    error: ''
					    , msg: ''
				    });
				    console.log('\n', 'DB', '\n', index.sql, '\n', e.message);
			    }
		    });
		}
	});
};