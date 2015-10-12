'use strict';

var Promise = require('promise')

	, bower = require('bower')

	, Bower = {
		/**
		 * @method
		 * */
		search: function(name){
			return new Promise(function(resolve, reject){
				bower.commands.search(name, {}).on('end', function (results) {
					resolve( results );
				}).on('error', function(e){
					reject(e);
				});
			});
		}
		, install: function(name, log, promptCB){
			return new Promise(function(resolve, reject){
				bower.commands.install([name], {
					save: true, forceLatest: true
				}, {
					interactive: true
				}).on('log', function(msg){  // 记录
					var info = {}
						, type = ''
						;
					console.log('msg');
					console.log(msg);
					if( msg.level !== 'conflict' ){
						type = 'info';

						info = {
							level: msg.level
							, id: msg.id
							, message: msg.message
						};
					}
					else{
						type = 'conflict';
						console.log('msg.data.picks');
						console.log(msg.data.picks);

						info = msg.data.picks.map(function(d, i){

							console.log('msg.data.picks', i);
							console.log(d);

							var dependants = d.dependants;
							console.log('dependants');
							console.log( dependants);

							d = d.endpoint;
							console.log('endpoint');
							console.log(d);

							return {
								name: d.name
								, version: d.target
								, required: dependants.map(function(d, i){
									var t = d.endpoint;
									console.log(t);

									return {
										name: t.name
										, version: t.target
									};
								})
							};
						});
					}

					log(type, info);
				}).on('prompt', function(prompts, callback){
					// todo 分支选择

					promptCB(prompts, callback);
				}).on('error', function(e){
					reject( e );
				}).on('end', function(installed){
					var info = []
						, obj, temp, k, t
						, name
						;

					for( k in installed ) if( installed.hasOwnProperty(k) ){

						t = installed[k].pkgMeta;
						name = k;

						obj = {
							name: name
							, version: '~'+ (t.version || '1.0.0')
							, source: t._source
							, homepage: t.homepage
							, tags: ''
							, css_path: ''
							, js_path: ''
						};

						temp = t.main;

						if( typeof temp === 'string' ){
							if( /\.js$/.test(temp) ){
								obj.js_path = name +'/'+ temp;
							}
							else if( /\.css$/.test(temp) ){
								obj.css_path = name +'/'+ temp;
							}
						}
						else if( Array.isArray(temp) ){
							obj.js_path = temp.filter(function(d){
								return /\.js$/.test(d);
							});
							obj.js_path = obj.js_path.length ? name +'/'+ obj.js_path.join(','+ name +'/') : '';

							obj.css_path = temp.filter(function(d){
								return /\.css$/.test(d);
							});
							obj.css_path = obj.css_path.length ? name +'/'+ obj.css_path.join(','+ name +'/') : '';
						}

						info.push(obj);
					}

					console.log(installed);
					resolve( info );
				});
			});
		}
	}
	;

module.exports = Bower;