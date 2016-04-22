'use strict';

var db = require('../db.js')
	, config = require('../../config.js')
	, error = require('../error.js')

	, TABLE_NAME = config.db.dataTablePrefix +'user'

	, UserError = require('./error.js')

	, SQL = {
		//userTag: 'insert into user_tag(user_id,tags) values(:userId,:tags)'
		//,

		userAvatarByEmail: 'select avatar from '+ TABLE_NAME +' where email=:email'
		, userByEmail: 'select id,email,password,username,avatar from '+ TABLE_NAME +' where email=:email'
	}
	, UserModel = {
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

		, getUserAvatarByEmail: function(email){
			return db.handle({
				sql: SQL.userAvatarByEmail
				, data: {
					email: email
				}
			});
		}
		, getUserByEmail: function(email){
			return db.handle({
				sql: SQL.userByEmail
				, data: {
					email: email
				}
			});
		}
	}

	//, UserData
	//, UserModel = require('../model.js')({
	//	id: {
	//		type: ''
	//	}
	//})
	;

module.exports = UserModel;