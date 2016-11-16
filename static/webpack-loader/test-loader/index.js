/**
 * 将此文件及其上级文件夹复制到 node_modules 文件夹下
 * */
module.exports = function(source, map){
	// 让 loader 缓存
	this.cacheable();

	// var callback = this.async();

	return 'module.exports=' + source + ';function b(){return {a: 1}};';
};