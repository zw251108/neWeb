/**
 *
 * */
var User = {
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
		return !!user.id;
	}
};

module.exports = User;