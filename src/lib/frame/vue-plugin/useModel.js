'use strict';

/**
 *
 * */

import Model    from '../model/index.js';

// let cookie  = Model.factory('c')
// 	, ls    = Model.factory('ls')
// 	, ss    = Model.factory('ss')
// 	, idb   = Model.factory('idb')
// 	;

/**
 * @param   {Object}    options={}
 * @param   {String}    options.namespace
 * */
function createPlugin(options={}){
	return (store)=>{
		let namespace = options.namespace || ''
			, tempModel = Model.factory( namespace )
			;

		// store.dispatch(namespace +'');

		// store.registerModule(namespace, {
		//
		// });

		tempModel.on((topic, value)=>{
			store.commit(topic, value);
		});

		// store.subscribe((mutation)=>{
		// 	if( mutation.type === 'UPDATE_DATA' ){
		// 		tempModel.setData( mutation.payload );
		// 	}
		// });
	};
}

export default createPlugin;