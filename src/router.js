import maple from 'cyan-maple';

import Index    from './view/index.js';
import Blog     from './view/blog.js';
import Album    from './view/album.js';
import Img      from './view/img.js';
import Valhalla from './view/valhalla.js';

import Edit from './view/edit.js'
import Test from './view/test.js';

export default function initRouter(app){
	return new maple.Router({
		mode: 'hash'
		, routers: [{
			path: '/'
			, callback(){
				app.setState({
					current: 'index'
					, view: (<Index></Index>)
				})
			}
		}, {
			path: '/index'
			, callback(){
				app.setState({
					current: 'index'
					, view: (<Index></Index>)
				})
			}
		}, {
			path: '/blog'
			, callback(params){
				app.setState({
					current: 'blog'
					, view: (<Blog id={params.id}></Blog>)
				});
			}
		}, {
			path: '/album'
			, callback(params){
				app.setState({
					current: 'album'
					, view: (<Album id={params.id}></Album>)
				});
			}
		}, {
			path: '/img'
			, callback(params){
				app.setState({
					current: 'img'
					, view: (<Img id={params.id}></Img>)
				});
			}
		}, {
			path: '/valhalla'
			, callback(){
				app.setState({
					current: 'valhalla'
					, view: (<Valhalla />)
				});
			}
		}, {
			path: '/edit'
			, callback(params){
				app.setState({
					current: 'edit'
					, view: (<Edit id={params.id}></Edit>)
				})
			}
		}, {
			path: '/test'
			, callback(){
				app.setState({
					current: 'test'
					, view: (<Test />)
				});
			}
		}]
		, fallback(url){
		}
	});
}