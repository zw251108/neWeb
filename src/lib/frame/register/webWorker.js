'use strict';

function registerWebWorker(options){
	let config = Object.keys( regServiceWorker._CONFIG ).reduce((all, d)=>{
		if( d in options ){
			all[d] = options[d];
		}
		else{
			all[d] = regServiceWorker._CONFIG[d];
		}

		return all;
	}, {});

	if( 'Worker' in self ){

	}
}

registerWebWorker._CONFIG = {
	file: 'ww.js'
};

export default registerWebWorker;