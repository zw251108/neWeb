'use strict';

var db      = require('../db.js')
	, error = require('../error.js')

	, Promise   = require('promise')

	, UserError = require('./error.js')

	, SQL = {
		userTag: 'insert into user_tag(user_id,tags) values(:userId,:tags)'
		, userAvatar: 'select avatar from user where email=:email'
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

		, userAvatarByEmail: function(email){
			return db.handle({
				sql: SQL.userAvatar
				, data: {
					email: email
				}
			}).then(function(rs){
				var result = {}
					;

				if( rs && rs.length ){
					result.avatar = rs[0].avatar
				}

				return result;
			});
		}
	}

	, UserData

	, UserModel = require('../model.js')({
		id: {
			type: ''
		}
	})
	;

module.exports = Model;