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

	, tpl           = require('./tpl.js').tpl
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template
	, header        = tpl('header')
	, footer        = tpl('footer')
	, moduleTpl     = emmetTpl({
		template: 'div.Container>section#%moduleId%.module.module-main.module-%moduleId%.large>div.module_content{%moduleContent%}'
	})
	, stylesheetTpl = emmetTpl({
		template: 'link[rel=stylesheet href=%path%]'
	})
	, styleTpl      = emmetTpl({
		template: 'style{%style%}'
	})
	, scriptTpl     = emmetTpl({
		template: 'script[data-main=%main% src=%require%]'
	})

	, dlTpl         = emmetTpl({
		template: 'dt.icon.icon-arrow-r{%title%}+dd{%content%}'
	})
	, sectionTpl    = emmetTpl({
		template: 'section.document_section.section>h3.section_title[section_id=%section_id%]{%section_title%}>span.icon.icon-minus^dl{%dl%}'
		, filter: {
			dl: function(d){
				return dlTpl(d.dl).join('');
			}
		}
	})
	;

module.exports = function(web, db, socket){
	var document = Document;

	web.get('/document/', function(req, res){
		var index = document.index
			;

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