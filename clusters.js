'use strict';

var cluster = require('cluster')
	, os    = require('os')
	, CPUS = os.cups()
	;

if( cluster.isMaster ){
	CPUS.forEach(function(){
		cluster.fork();
	});

	cluster.on('listening', function(worker){
		console.log('Cluster %d contented', worker.process.pid);
	});
	cluster.on('disconnect', function(worker){
		console.log('Cluster %d disconnected', worker.process.pid);
	});
	cluster.on('exit', function(worker){
		console.log('Cluster %d dead', worker.process.pid);

		cluster.fork();
	});
}
else{
	require('./index.js');
}


