import Blog                                      from './blog/model.js';
import User, {UserInfo}                          from './user/model.js';
import {City, Village, District, Town, Province} from './basedata/model.js';
import {Document, Section, Content}              from './document/model.js';
import {Todo, Task} from './todo/model.js'
import db                                        from './db.js';

// Blog.create({
// 	title: 'test'
// }).then((blog)=>{
// 	console.log( JSON.stringify(blog.toJSON(), null, 4) );
// });

// User.findAll({
// 	where: {
// 		id: 1
// 	}
// 	, include: [{
// 		model: UserInfo
// 		, as: 'userInfo'
// 	}, {
// 		model: Blog
// 		, as: 'blog'
// 	}]
// }).then((list)=>{
// 	console.log(1, list)
// });

// Blog.findAll({
// 	where: {
// 		id: 1
// 	}
// 	, include: [{
// 		model: User
// 		, as: 'user'
// 	}]
// }).then((list)=>{
// 	console.log(2, list)
// 	console.log(list[0].user)
// })

// Province.findAll({
// 	where: {
// 		id: 2
// 	}
// 	, include: [{
// 		model: City
// 		, as: 'city'
// 	}]
// }).then((ls)=>{
// 	console.log(ls)
// })

// City.findAll({
// 	where: {
// 		id: 2
// 	}
// 	, include: [{
// 		model: Province
// 		, as: 'province'
// 	}, {
// 		model: District
// 		, as: 'district'
// 	}]
// }).then((list)=>{
// 	console.log(3, list);
// 	console.log(list[0].province)
// 	console.log(list[0].district)
// })

// Document.findAll({
// 	where: {
// 		id: 2
// 	}
// 	, include: [{
// 		model: Section
// 		, as: 'section'
// 	}]
// }).then(console.log)

// Section.findAll({
// 	where: {
// 		id: 2
// 	}
// 	, include: [{
// 		model: Document
// 		, as: 'document'
// 	}, {
// 		model: Content
// 		, as: 'content'
// 	}]
// }).then(console.log);

// Todo.findAll({
// 	where: {
// 		id: 2
// 	}
// 	, include: [{
// 		model: Task
// 		, as: 'task'
// 	}]
// }).then(console.log);
// Task.findAll({
// 	where: {
// 		id: 2
// 	}
// 	, include: [{
// 		model: Todo
// 		, as: 'todo'
// 	}]
// }).then(console.log);

// db.authenticate().then((e)=>{
// 	if( e ){
// 		console.log(e);
// 		return;
// 	}
//
// 	console.log('database connect success');
// });

// function createRequest({pool}){
// 	let count = 0
// 		, waitQueue = []
// 	;
//
// 	function next(rs){
// 		count--;
//
// 		if( count < pool && waitQueue.length > 0 ){
// 			let {url, params, resolve} = waitQueue.pop();
//
// 			fetch(url, params).catch(()=>{return 1;}).then((rs)=>{
// 				resolve( rs );
//
// 				count++;
// 				next();
// 			});
// 		}
//
// 		return rs;
// 	}
//
// 	return function(url, params){
// 		if( count < pool ){
// 			let t = fetch(url, params).catch(()=>{return 1;});
//
// 			count++
//
// 			return t.then( next );
// 		}
// 		else{
// 			return new Promise((resolve)=>{
// 				waitQueue.push({
// 					url
// 					, params
// 					, resolve
// 				});
// 			});
// 		}
// 	}
// }
//
// let a = createRequest({pool: 3});
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');
// a('http://midway.test.66buy.com.cn/shopping/home/init.node?cityId=2554&_=1604399263369');

// User.findOne({
// 	where: {
// 		id: 1
// 	}
// 	, include: [{
// 		model: Blog
// 		, as: 'blog'
// 	}]
// }).then(({blog})=>{
// 	console.log(JSON.stringify(blog))
// });
Blog.findAll({
	attributes: ['id', 'title', 'updateDate']
	, where: {
		creatorId: 1
	}
}).then((list)=>{
	console.log(list)
});