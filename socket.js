/**
 * Web Socket 服务器
 *
 * */
var sio = require('socket.io')()
	, CLIENT_LIST = {}
	, CLIENT_INDEX_LIST = []
	;

var dbInterface = {}
	;

//function guid(){
//	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
//		var r = Math.random()*16|0, v = c==='x'? r : (r&0x3|0x8);
//		return v.toString(16);
//	}).toUpperCase();
//}

sio.on('connection', function(socket){

	// todo 设置索引
	// todo 应该获取 session
 	var session = socket.handshake.session
		, clientIndex = session.id
	    ;
	CLIENT_LIST[clientIndex] = socket;
	CLIENT_INDEX_LIST.push( clientIndex );

	console.log('socket: session id ', clientIndex, 'connect');

	socket.on('login', function(user){  // 登录接口
        var username = user.username
            , pwd = user.password
            ;

		console.log('user username: ', username, 'login');

        dbInterface.select('select * from user where email=\'' + username +'\'', function(rs){
            var userData = rs[0]
                ;

            if( userData.password = pwd ){
                delete userData.password;
                socket.emit('login', userData);
            }
            else{
                console.log('用户密码错误');
                socket.emit('login', {error: 1});
            }
        }, function(){
            console.log('数据库查询错误');
            socket.emit('login', {error: 2});
        });
    }).on('getData', function(query){   // 获取数据接口
		var topic = query.topic
			, receive = query.receive
			, sql
			, dbCallback
			, dbErr = function(){
				socket.emit(receive, {});
			}
			, id = query.id
			, uid = query.uid
			;

		console.log('get data topic:', topic);

		switch( topic ){
			case 'document':
				sql = 'select title,content,section_title from document order by section_id';
				dbCallback = function(rs){
					var document = []
						, tempTitle = ''
						, tempArray
						, i, j;

					for(i = 0, j = rs.length; i < j; i++){
						if( rs[i].section_title !== tempTitle ){
							tempTitle = rs[i].section_title;
							tempArray = [];
							document.push({
								section_title: tempTitle
								, dl: tempArray
							});
						}

						tempArray.push( rs[i] );
					}
					socket.emit(receive, document);
				};
				break;
			case 'blog':
				sql = 'select Id,title,datetime,tagsId,tagsName from blog where status=1 order by Id desc';
				dbCallback = function(rs){
					socket.emit(receive, rs);
				};
				break;
			case 'blog/detail':
				sql = 'select content from blog where id='+ id;
				dbCallback = function(rs){
					rs[0].id = id;
					socket.emit(receive, rs[0]);
				};
				break;
			case 'talk':
				sql = 'SELECT Id, title as content, \'blog\' as type, datetime FROM blog ' +
					'UNION ALL ' +
					'SELECT Id, content, \'message\' as type, datetime FROM message';
				dbCallback = function(rs){
					socket.emit(receive, rs);
				};
				break;
			default:
				break;
		}
		sql && dbInterface.select(sql, dbCallback, dbErr);
	}).on('message', function(data){    // 即时通信接口
		console.log('user chat');
	}).on('disconnect', function(){ // 断开连接
		console.log('socket: session id ', clientIndex, 'disconnect');
	});
});

exports.listen = function(webServer, db){
	dbInterface = db;
	return sio.listen( webServer );
};