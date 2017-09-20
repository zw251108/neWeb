'use strict';

/**
 * @summary 将数据添加到 vm 中
 * @param   {Vue}       vm
 * @param   {Array}     data
 * @param   {Object}    [options={}]
 * @param   {String[]}  [options.makeArray]
 * @return  {Array}     将 data 返回
 * */
export default (vm, data, options={})=>{
	data.forEach((d)=>{
		let key = d.key || d.name
			;

		if( options.makeArray && options.makeArray.indexOf(key) >= 0 ){
			if( key in vm ){
				vm[key].push( d.data );
			}
			else{
				vm.$set(key, [d.data]);
			}
		}
		else{
			vm.$set(key, d.data);
		}
	});

	return data;
}