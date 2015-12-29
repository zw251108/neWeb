'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, UserError = require('./error.js')

	, SQL = {
		userTag: 'insert into user_tag(user_id,tagse) values(:userId,:tags)'
	}
	, Model = {
	/**
	 * @method  对用户添加标签操作
	 * @param   {object}    userTag
	 * @param   {string}    userTag.userId
	 * @param   {string}    userTag.tags
	 * @param   {string}    userTag.targetId
	 * @param   {string}    userTag.targetType
	 * @return  {object(Promise)}   数据库返回的结果
	 * */
		userTag: function(userTag){
			return db.handle({
				sql: SQL.userTag
				, data: userTag
			}).then(function(rs){
				var result = userTag
					;

				if( rs && rs.insertId ){
					result.id = rs.insertId;
				}
				else{
					result = Promise.reject(new TagError('未知错误'));
				}

				return result;
			});
		}
	}

	, UserData

	, UserModel = require('../model.js')({
		Id: {
			type: ''
		}
	})
	;

module.exports = Model;