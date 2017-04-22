'use strict';

/**
 * @class
 * @classdesc
 * */
class Task{
	/**
	 * @constructor
	 * */
	constructor(){
		this._tasks = [];
	}
	_handleArray(){}
	_handleFunction(){}
	_handleObject(){}

	_runByFrame(){}
	_runByPromise(){}

	frameTask(){}
	animateTask(){}

	// /**
	//  * @param   {Function|Object|Array|Promise} operate
	//  * @param   {Function}  [operate.run]
	//  * @return  {Promise}
	//  * */
	// add(operate){
	// 	let result
	// 		;
	//
	// 	if( operate instanceof Promise ){
	//
	// 	}
	// 	else if( Array.isArray(operate) ){
	// 		result = Promise.all( operate );
	// 	}
	// 	else if( operate instanceof Function ){
	// 		result = Promise.resolve( operate() );
	// 	}
	// 	else if( operate instanceof Object ){
	// 		if( 'run' in operate ){
	// 			result = Promise.resolve( operate.run() );
	// 		}
	// 		else{
	// 			result = Promise.resolve( operate );
	// 		}
	// 	}
	// 	else{
	// 		result = Promise.reject();
	// 	}
	//
	// 	return result;
	// }

	addTask(task){
		this._tasks.push( task );
	}

	draw(){
		window.requestAnimationFrame(()=>{
			let tasks = this._tasks;

			if( tasks.length ){
				let task = tasks.shift();

				task();
			}

			if( tasks.length ){
				this.draw();
			}
		});
	}
}

export default Task;