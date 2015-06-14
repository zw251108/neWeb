'use strict';

/**
 * 临时使用脚本文件
 * */
var db = require('mysql').createConnection({
		host: 'localhost'
		, port: 3306
		, user: 'root'
		, password: 'zw251108'
		, database: 'destiny'
		, dateStrings: true
	})
	/**
 * 访问 路径
 * */
	, superAgent = require('superagent')

	/**
 * cheerio
 *  解析 HTML 结构
 * */
	, Cheerio = require('cheerio')
	, error = function(e){
		console.log(e);
	}
	, getArticle = function(url, done){
		console.log('获取 feed 文章：', url);

		superAgent.get(url).end(function(err, res){
			if( !err ){
				var html = res.text
					, $
					, $main
					;

				if( html ){
					$ = Cheerio.load(html, {decodeEntities: false});

					$main = $('title');

					done( $main.text() );
				}
				else{
					error( err );
				}
			}
			else{
				error( err );
			}
		})

	}
	, handle = function(temp){
		getArticle(temp.url, function(title){
			console.log(title);
			db.query('update reader set title=? where Id=?', [title, temp.Id], function(rs){
				console.log( temp.Id)
			})
		});
	}
	;

db.query('select * from reader where status<>?', ['2'], function(e, rs){
	if( !e ){
		var i, j
			, temp
			;

		for(i = 0, j = rs.length; i < j; i++){
			handle( rs[i] );
		}
	}
	else{
		console.log(e);
	}
});