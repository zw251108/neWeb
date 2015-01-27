'use strict';

var Document = {
	index: {
		sql: 'select title,content,section_title from document order by section_id,`order`'
		, handler: function(rs){
			var document = []
				, tempTitle = ''
				, tempArray
				, i, j
				;

			for(i = 0, j = rs.length; i < j; i++){
				if( rs[i].section_title !== tempTitle ){
					tempTitle = rs[i].section_title;
					tempArray = [];
					document.push({
						section_title: tempTitle
						, dl: tempArray
					});
				}

				tempArray.push( rs[i] );
			}
			return document;
		}
	}
};

module.exports = function(web, db, socket){
	var document = Document
		, header = web.get('header')
		, footer = web.get('footer')
		, emmetTpl = web.get('emmetTpl')
		, moduleTpl = web.get('moduleTpl')
		, stylesheetTpl = web.get('stylesheetTpl')
		, scriptTpl = web.get('scriptTpl')
		, dlTpl = emmetTpl({
			template: 'dt.icon.icon-arrow-r{%title%}+dd{%content%}'
		})
		, sectionTpl = emmetTpl({
			template: 'section.document_section.section>h3.section_title{%section_title%}>span.icon.icon-minus^dl{%dl%}'
			, filter: {
				dl: function(d){
					return dlTpl(d.dl).join('');
				}
			}
		})
		;

	web.get('/document/', function(req, res){
		var index = document.index;

		db.query(index.sql, function(e, rs){
			if( !e ){
				rs = index.handler( rs );

				res.send( header.replace('%pageTitle%', '前端文档 Document')
					.replace('%style%', stylesheetTpl({
						path: '../script/plugin/codeMirror/lib/codemirror.css'
					}).join('')) + moduleTpl([{
					moduleId: 'document'
					, moduleContent: sectionTpl(rs).join('')
				}]).join('') + scriptTpl([{
					main: '../script/module/document/index'
					, require: '../script/lib/require.min.js'
				}]).join('') + footer);
			}
			else{
				console.log('\n', 'db', '\n', index.sql, '\n', e.message);
			}

			res.end()
		});
	});
};