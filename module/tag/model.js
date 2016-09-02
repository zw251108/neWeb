'use strict';

var db      = require('../db.js')
	, error = require('../error.js')
	, TagError = require('./error.js')

	, SQL   = {
		tag: 'select name,num from tag order by num'
		, tagAll: 'select * from tag'
		, tagAdd: 'insert into tag(name,user_id) select :name,:userId from dual where not exists (select * from tag where name like :name)'
		, tagIncrease: 'update tag set num=num+:increase where name=:name'
		, tagIsExist: 'select * from tag where name=:name'
	}
	, TagModel = {
		/**
		 * @method  获取全部标签
		 * @return  {object(Promise)}   数据库返回结果
		 * */
		getAll: function(){
			return db.handle({
				sql: SQL.tagAll
			}).then(function(rs){
				var result = [];

				if( rs && rs.length ){
					result = rs;
				}

				return result;
			});
		}

		/**
		 * @method  添加标签
		 * @param   {object}    tag 标签数据
		 * @param   {string}    tag.name    标签名称
		 * @param   {string}    tag.userId  创建者名称
		 * @return  {object(Promise)}   数据库返回结果
		 * @desc
		 *  Promise 返回结果：
		 *      正确：带 id 标签数据
		 * */
		, add: function(tag){
			return db.handle({
				sql: SQL.tagAdd
				, data: tag
			}).then(function(rs){
				var result = tag;

				if( rs && rs.insertId ){
					result.id = rs.insertId
				}
				else{
					result = Promise.reject( new TagError(tag.name + ' 标签已存在') );
				}

				return result;
			});
		}

		/**
		 * @method  对标签增加数量
		 * @param   {object}    tag 标签数据
		 * @param   {string}    tag.name    标签名称
		 * @param   {num}       tag.num     标签增加数量
		 * @return  {object(Promise)}   数据库返回的结果
		 * */
		, increaseByName: function(tag){
			return db.handle({
				sql: SQL.tagIncrease
				, data: tag
			}).then(function(rs){
				var result;

				if( rs && (rs.changedRows || rs.affectedRows) ){
					result = true;
				}
				else{
					result = Promise.reject( new TagError(tag.name + ' 标签不存在') );
				}

				return result;
			});
		}

		/**
		 * @method  检测标签名是否存在
		 * @param   {string}    name    要检测标签名
		 * @return  {boolean}   是否存在
		 * */
		, isExist: function(name){
			return db.handle({
				sql: SQL.tagIsExist
				, data: {
					name: name
				}
			}).then(function(rs){
				return !!(rs && rs.length);
			});
		}
	}
	;

module.exports = TagModel;