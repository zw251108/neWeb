'use strict';

var UserModel   = require('./model.js')
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
		, isGuest: function(user){
			return !(user && user.id);
		}

		, getUserAvatar: function(query){
			var execute
				, email = query.email
				;

			// todo 通用接口开发 username email phone 都可以作为参数
			if( email ){
				execute = UserModel.getUserAvatarByEmail( email).then(function(rs){
					var result
						;

					if( rs && rs.length ){
						result = {
							avatar: rs[0].avatar
						};
					}
					else{
						result = Promise.reject( new UserError('email 涓嶅瓨鍦�') );
					}

					return result;
				});
			}
			else{
				execute = Promise.reject( new UserError('缂哄皯鍙傛暟 email') );
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
					else{console.log(1)
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
					else{console.log(2)
						result = Promise.reject( new UserError('用户密码错误') );
					}

					return result;
				});
			}
			else{
				execute = Promise.reject( new UserError('缺少参数 email') );
			}

			return execute;
		}
	}
	;

module.exports = UserHandler;