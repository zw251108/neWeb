import maple from 'cyan-maple';

import Index    from './view/index.js';
import Blog     from './view/blog.js';
import Album    from './view/album.js';
import Img      from './view/img.js';
import Valhalla from './view/valhalla.js';
import Document from './view/document.js';
import Resume   from './view/resume.js';
import Editor   from './view/editor.js';

const paths = [{
		name: 'index'
		, Target: Index
	}, {
		name: 'blog'
		, Target: Blog
	}, {
		name: 'album'
		, Target: Album
	}, {
		name: 'img'
		, Target: Img
	}, {
		name: 'document'
		, Target: Document
	}, {
		name: 'editor'
		, Target: Editor
	}, {
		name: 'valhalla'
		, Target: Valhalla
	}, {
		name: 'resume'
		, Target: Resume
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
		]
		, fallback(url){
		}
	});
}