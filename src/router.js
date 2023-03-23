import maple from 'cyan-maple';

import Index    from './view/index.js';
import Blog     from './view/blog.js';
import Album    from './view/album.js';
import Img      from './view/img.js';
import Valhalla from './view/valhalla.js';
import Document from './view/document.js';

const paths = [{
		path: 'index'
		, Target: Index
	}, {
		path: 'blog'
		, Target: Blog
	}, {
		path: 'album'
		, Target: Album
	}, {
		path: 'img'
		, Target: Img
	}, {
		path: 'valhalla'
		, Target: Valhalla
	}, {
		path: 'document'
		, Target: Document
	}]
	;

export default function initRouter(app){
	return new maple.Router({
		mode: 'hash'
		, routers: [{
			path: '/'
			, callback(){
				app.setState({
					current: 'index'
					, view: (<Index></Index>)
				});
			}
		},
		...paths.map(({name, Target})=>{
			return {
				path: `/${name}`
				, callback(params){
					app.setState({
						current: name
						, view: <Target id={params.id}></Target>
					});
				}
			}
		})
		// }, {
		// 	path: '/index'
		// 	, callback(){
		// 		app.setState({
		// 			current: 'index'
		// 			, view: (<Index></Index>)
		// 		})
		// 	}
		// }, {
		// 	path: '/blog'
		// 	, callback(params){
		// 		app.setState({
		// 			current: 'blog'
		// 			, view: (<Blog id={params.id}></Blog>)
		// 		});
		// 	}
		// }, {
		// 	path: '/document'
		// 	, callback(params){
		// 		app.setState({
		// 			current: 'document'
		// 			, view: (<Document id={params.id}></Document>)
		// 		});
		// 	}
		// }, {
		// 	path: '/album'
		// 	, callback(params){
		// 		app.setState({
		// 			current: 'album'
		// 			, view: (<Album id={params.id}></Album>)
		// 		});
		// 	}
		// }, {
		// 	path: '/img'
		// 	, callback(params){
		// 		app.setState({
		// 			current: 'img'
		// 			, view: (<Img id={params.id}></Img>)
		// 		});
		// 	}
		// }, {
		// 	path: '/valhalla'
		// 	, callback(){
		// 		app.setState({
		// 			current: 'valhalla'
		// 			, view: (<Valhalla />)
		// 		});
		// 	}
		// }, {
		// 	path: '/edit'
		// 	, callback(params){
		// 		app.setState({
		// 			current: 'edit'
		// 			, view: (<Edit id={params.id}></Edit>)
		// 		})
		// 	}
		// }, {
		// 	path: '/test'
		// 	, callback(){
		// 		app.setState({
		// 			current: 'test'
		// 			, view: (<Test />)
		// 		});
		// 	}
		]
		, fallback(url){
		}
	});
}