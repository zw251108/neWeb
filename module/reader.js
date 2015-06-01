'use strict';

var Reader = {
		index: {
			sql: 'select url,status from reader order by desc'
		}
		, checked: {
			sql: 'select url where url like ?'
		}
		, add: {
			sql: 'insert reader(url) value(?,now())'
		}
	}

	, tpl           = require('./tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, articleTpl    = emmetTpl({
		template:'article#blogArt%Id%.article>a[href=%url% title=%url% target=_blank]>h3.article_title{%url%}'
	})
	;

module.exports =  function(web, db, socket, metro){
	var reader = Reader;

	metro.push({
		id: 'reader'
		, type: 'metro'
		, size: 'tiny'
		, title: '待读文章 reader'
	});

	web.get('/reader/', function(req, res){
		var index = reader.index;

		db.query(index.sql, function(e, rs){
			if( !e ){
				res.send(tpl.html('module', {
					title: '待读文章 reader'
					, modules: tpl.mainTpl({
						id: 'reader'
						, title: '待读文章 reader'
						, content: articleTpl(rs).join('')
					}).join('')
					//, script: {
					//	main: '../script/module/blog/index'
					//	, src: '../script/lib/require.min.js'
					//}
				}) );
			}
			else{
				console.log('\n', 'db', '\n', index.sql, '\n', e.message);
			}
			res.end();
		});
	});

	socket.register({
		reader: function(){

		}
		, 'reader/add': function(socket, data){
			var url = data.query.url
				;

			if( url ){
				db.query(reader.checked.sql, ['%'+ url +'%'], function(e, rs){
					if( !e ){
						if( rs ){
							socket.emit('getData', {
								topic: 'reader/add'
								, info: {}
							});
						}
						else{
							db.query(reader.add.sql, [url], function(e, rs){
								socket.emit('getData', {
									topic: 'reader/add'
									, msg: 'success'
									, id: rs.insertId || id
								});
							});
						}
					}
					else{
						socket.emit('getData', {
							error: ''
							, msg: ''
						});
						console.log('\n', 'db', '\n', detail.sql, '\n', e.message);
					}
				});
			}
			else{
				socket.emit('getData', {
					error: ''
					, msg: ''
				});
				console.log('\n', 'socket blog/detail', '\n', 'no id');
			}
		}
	})
};