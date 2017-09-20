'use strict';

let vmModelProxy = (vm, model, key, filterKeys=[])=>{

	Object.keys( vm.$data ).filter((k)=>{
		return filterKeys.indexOf( k ) === -1;
	}).forEach((k)=>{
		vm.$watch(k, (newVal)=>{
			model.setData(key, Promise.resolve(newVal));
		})
	});
	
	// vm.$watch(key, (newVal, oldVal)=>{
	// 	model.setData(key, Promise.resolve(newVal));
	// });
};

export default vmModelProxy;