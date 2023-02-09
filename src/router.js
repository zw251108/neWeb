import maple from 'cyan-maple';

import './config.js';

import Index from './view/index.js';
import Blog from './view/blog.js';

export default function initRouter(app){
	return new maple.Router({
		mode: 'hash'
		, routers: [{
			path: '/'
			, callback(){
				let list = [{
						title: 1
						, desc: 'asdfasdf'
						, id: 1
						, type: 'blog'
					}, {
						title: 11
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 12
						, desc: 'asdfasdf'
						, id: 21
						, src: '//img1.tg-img.com/seller/202302/08/5528E60B-DC20-4550-A368-C328770E6639.jpg'
						, type: 'img'
					}, {
						title: 13
						, desc: 'asdfasdf'
						, id: 22
						, type: 'blog'
					}, {
						title: 14
						, desc: 'asdfasdf'
						, id: 23
						, type: 'blog'
					}, {
						title: 15
						, desc: 'asdfasdf'
						, id: 24
						, type: 'blog'
					}, {
						title: 16
						, desc: 'asdfasdf'
						, id: 25
						, type: 'blog'
					}, {
						title: 17
						, desc: 'asdfasdf'
						, id: 26
						, type: 'blog'
					}, {
						title: 18
						, desc: 'asdfasdf'
						, id: 27
						, type: 'blog'
					}, {
						title: 19
						, desc: 'asdfasdf'
						, id: 3
						, type: 'blog'
					}, {
						title: 10
						, desc: 'asdfasdf'
						, id: 4
						, type: 'blog'
					}, {
						title: 111
						, desc: 'asdfasdf'
						, id: 5
						, type: 'blog'
					}]
					;
				console.log(123)

				let A = Index;

				app.setState({
					current: 'index'
					, view: (<A list={list}></A>)
				})
			}
		}, {
			path: '/index'
			, callback(){console.log(arguments)
				let list = [{
						title: 1
						, desc: 'asdfasdf'
						, id: 1
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 2
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 3
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 4
						, type: 'blog'
					}, {
						title: 1
						, desc: 'asdfasdf'
						, id: 5
						, type: 'blog'
					}]
					;
				             console.log('index');
				app.setState({
					current: 'index'
					, view: (<Index list={list}></Index>)
				})
			}
		}, {
			path: '/blog'
			, callback(params){
				console.log(params);
				app.setState({
					current: 'blog'
					, view: (<Blog id={params.id}></Blog>)
				});
			}
		}]
		, fallback(url){
		}
	});
}