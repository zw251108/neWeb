'use strict';

var utils = require('utility')

	, UserModel   = require('./model.js')
	, UserError = require('./error.js')
	, UserHandler = {
		getUserFromSession: {
			fromReq: function(req){
				var session = req.session || {}
					;

				return session.user || {};
			}
			, fromSocket: function(socket){
				var session = socket.handshake.session
					;

				return session.user || {};
			}
		}
		, setUserToSession: function(user, session){
			var u = session.user || {}
				, k
				;

			for( k in user ) if( user.hasOwnProperty(k) ){
				u[k] = user[k];
			}

			session.user = u;
		}
		, isGuest: function(user){
			return !(user && user.id);
		}

		, getUserAvatar: function(query){
			var execute
				, email = query.email
				;

			// todo 通用接口开发 username email phone 都可以作为参数
			if( email ){
				execute = UserModel.getUserAvatarByEmail( email ).then(function(rs){
					var result
						;

					if( rs && rs.length ){
						result = {
							avatar: rs[0].avatar
						};
					}
					else{
						result = Promise.reject( new UserError('email 不存在') );
					}

					return result;
				});
			}
			else{
				execute = Promise.reject( new UserError('缺少参数 email') );
			}

			return execute;
		}
		, userLogin: function(query){
			var execute
				, email = query.email
				, password = query.password
				;

			// todo 通用接口开发 username email phone 都可以作为参数
			if( email ){
				execute = UserModel.getUserByEmail( email ).then(function(rs){
					var result
						;

					if( rs && rs.length ){
						result = rs[0];
					}
					else{
						result = Promise.reject( new UserError('用户不存在') );
					}

					return result;
				}).then(function(rs){
					var result
						, pwd = rs.password
						;

					if( password === pwd ){
						result = rs;
					}
					else{
						result = Promise.reject( new UserError('用户密码错误') );
					}

					return result;
				}).then(function(rs){
					// 基于 email + 用户名 + 密码 + 日期 生成 md5 值
					var date = new Date()
						, m = date.getMonth() +1
						, d = date.getDate()
						;

					date = date.getFullYear() +'-'+ (m > 9 ? m : '0'+ m) +'-'+ (d > 9 ? d : '0'+ d);

					rs.token = utils.md5(rs.email + rs.username + rs.password + date);
					delete rs.password;

					UserHandler.updateToken(rs);

					return rs;
				});
			}
			else{
				execute = Promise.reject( new UserError('缺少参数 email') );
			}

			return execute;
		}
		, updateToken: function(user){
			return UserModel.updateUserToken(user);
		}
		, verifyToken: function(user){
			var execute
				, id = user.id
				, token = user.token
				;

			if( id && token ){
				execute = UserModel.getUserToken(user).then(function(rs){
					var execute
						, date
						, t
						;

					if( rs && rs.length ){
						date = rs[0].last_online_date;
						t = rs[0].token;

						// todo 判断过期时间
						if( t === token ){
							execute = Promise.resolve({
								verify: true
							});
						}
						else{
							execute = Promise.reject( new UserError('token 验证错误') );
						}
					}
					else{
						execute = Promise.reject( new UserError('用户不存在') );
					}

					return execute;
				});
			}
			else{
				execute = Promise.reject( new UserError('缺少参数 id token') );
			}

			return execute;
		}
	}
	;

module.exports = UserHandler;