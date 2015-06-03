'use strict';

var Reader = {
		index: {
			sql: 'select Id,url,status from reader order by Id desc'
		}
		, checked: {
			sql: 'select url from reader where url like ?'
		}
		, get: {
			sql: 'select status form reader where Id=?'
		}
		, add: {
			sql: 'insert reader(url,datetime) value(?,now())'
		}
		, read: {
			sql: 'update reader set status=1 where Id=?'
		}
		, favor: {
			sql: 'update reader set status=2 where Id=?'
		}
	}

	, tpl           = require('./tpl.js')
	, emmetTpl      = require('./emmetTpl/emmetTpl.js').template

	, articleTpl    = emmetTpl({
		template:'article#blogArt%Id%.article>a[href=%url% title=%url% target=_blank]>h3.article_title{%url%}' +
		'^hr+span.icon.icon-checkbox+span.icon.icon-star-empty+span.icon.icon-cancel'
		, filter: {
			status: function(d, i){

			}
		}
	})
	, checkExist = function(){

	}
	, checkRead = function(){}
	, checkFavor = function(){

	}
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
						, toolbar: tpl.toolbarTpl([{
							id: 'add', icon: 'plus', title: '添加待读文章'
						}])
						, content: articleTpl(rs).join('')
					}).join('') + tpl.popupTpl([{
						id: 'addPopup', size: 'normal'
							, content: '<form><div class="formGroup">' +
								'<label for="url">请输入链接</label>' +
								'<input type="text" id="url" class="input" placeholder="请输入标题" data-validator="url">' +
								'</div></form>'
							, button: '<button type="button" id="addReader" class="btn">确定</button>'
					}])
					, script: {
						main: '../script/module/reader/index'
						, src: '../script/lib/require.min.js'
					}
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
		, 'reader/read': function(socket, data){
			var id = data.query.id
				;

			if( id ){
				db.query(reader.get.sql, [id], function(e, rs){
					if( !e ){
						if( rs.length && +rs[0].status < 2 ){   // 数据存在并不为收藏状态
							db.query(reader.favor.sql, [id], function(e, rs){
								if( !e ){
									if( rs ){
										socket.emit('getData', {
											topic: 'reader/read'
											, msg: 'success'
											, id: id
										});
									}
									else{
										socket.emit('getData', {
											error: ''
											, msg: ''
										});
										console.log('\n', 'db', '\n', reader.read.sql, '\n', e.message);
									}
								}
								else{
									socket.emit('getData', {
										error: ''
										, msg: ''
									});
									console.log('\n', 'db', '\n', reader.read.sql, '\n', e.message);
								}
							})
						}
						else{
							socket.emit('getData', {
								error: ''
								, msg: '数据错误'
							});
							console.log('\n', 'db', '\n', reader.get.sql, '\n', e.message);
						}
					}
					else{
						socket.emit('getData', {
							error: ''
							, msg: ''
						});
						console.log('\n', 'db', '\n', reader.get.sql, '\n', e.message);
					}
				});
			}
			else{
				socket.emit('getData', {
					error: ''
					, msg: ''
				});
				console.log('\n', 'socket reader/read', '\n', 'no id')
			}
		}
		, 'reader/favor': function(socket, data){
			var id = data.query.id
				;

			if( id ){
				db.query(reader.favor.sql, [id], function(e, rs){
					if( !e ){
						if( rs ){
							socket.emit('getData', {
								topic: 'reader/favor'
								, msg: 'success'
								, id: id
							});
						}
						else{
							socket.emit('getData', {
								error: ''
								, msg: ''
							});
							console.log('\n', 'db', '\n', reader.favor.sql, '\n', e.message);
						}
					}
					else{
						socket.emit('getData', {
							error: ''
							, msg: ''
						});
						console.log('\n', 'db', '\n', reader.favor.sql, '\n', e.message);
					}
				})
			}
			else{
				socket.emit('getData', {
					error: ''
					, msg: ''
				});
				console.log('\n', 'socket reader/favor', '\n', 'no id')
			}
		}
		, 'reader/add': function(socket, data){
			var url = data.query.url
				;

			if( url ){
				db.query(reader.checked.sql, ['%'+ url +'%'], function(e, rs){
					if( !e ){
						//console.log(rs)
						if( Array.isArray( rs ) && rs.length ){
							socket.emit('getData', {
								topic: 'reader/add'
								, msg: '数据已存在'
							});
						}
						else{
							db.query(reader.add.sql, [url], function(e, rs){
								if( !e ){
									socket.emit('getData', {
										topic: 'reader/add'
										, msg: 'success'
										, id: rs.insertId || id
										, url: url
									});
								}
								else{
									socket.emit('getData', {
										error: ''
										, msg: ''
									});
									console.log('\n', 'db', '\n', reader.add.sql, '\n', e.message)
								}
							});
						}
					}
					else{
						socket.emit('getData', {
							error: ''
							, msg: ''
						});
						console.log('\n', 'db', '\n', reader.checked.sql, '\n', e.message);
					}
				});
			}
			else{
				socket.emit('getData', {
					error: ''
					, msg: ''
				});
				console.log('\n', 'socket reader/add', '\n', 'no url');
			}
		}
	})
};