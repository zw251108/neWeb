/**
 *
 * */
var bower = require('bower')
	//, db = require('mysql').createConnection({
	//	host: 'localhost'
	//	, port: 3306
	//	, user: 'root'
	//	, password: 'zw251108'
	//	, database: 'destiny'
	//	, dateStrings: true
	//})
	//, inquirer =  require('inquirer')
	;

//bower.commands.on('log', function(msg){
//	console.log(msg)
//	//if( msg.level === 'conflict' ){
//	//	msg.data.picks.forEach(function(d, i){
//	//		console.dir(d)
//	//	});
//	//
//	//	console.log(msg.data.picks.map(function(d, i){
//	//		var temp = d.endpoint;
//	//		return (i+1) + ') ' + temp.name + ' version: ' + temp.target;
//	//	}).join('\n'));
//	//}
//}).on('prompt', function(prompts, callback) {
//	console.log(prompts)
//	//callback({prompt: '2'});
//	//inquirer.prompt(prompts, callback);
//}).on('error', function(e){
//	console.log(e);
//}).on('end', function(installed){
//	//var name = installed
//	console.dir(installed);
//});

function install(names, log, prompt, error, end){
	if( typeof names === 'string' ) names = [names];

	bower.commands.install(['ember'], {save: true}, {}).on('log', function(msg){
			console.log(msg);
			//if( msg.level === 'conflict' ){
			//	msg.data.picks.forEach(function(d, i){
			//		console.dir(d)
			//	});
			//
			//	console.log(msg.data.picks.map(function(d, i){
			//		var temp = d.endpoint;
			//		return (i+1) + ') ' + temp.name + ' version: ' + temp.target;
			//	}).join('\n'));
			//}
		}).on('prompt', function(prompts, callback) {
			console.log(prompts);
			//callback({prompt: '2'});
			//inquirer.prompt(prompts, callback);
		}).on('error', function(e){
			console.log(e);
		}).on('end', function(installed){
			var name = installed.
				console.log(installed);
		});
}

//bower.commands.install(['ember-data'], {save: true}, {interactive: true});

function search(name, end){
	bower.commands.search('jquery', {}).on('end', function (results) {
		end(results);
		console.log(results);
	});
}

exports.bower = {
	install: install
	, search : search
};


//	function(user_db, user_socket){
//	db = user_db;
//	socket = user_socket;
//
//	user_socket.on('bower_search', function(name){
//		search('name');
//	});
//
//	//return {
//	//	install: install
//	//	, search: search
//	//}
//};
//search('angular');