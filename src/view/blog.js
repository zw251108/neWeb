import React, {useState, useEffect, useRef} from 'react';
import maple from 'cyan-maple';

import {imgPath}          from '../config.js';

import {createCodeEditor} from '../components/codeEditor/index.js';

import api                from '../api/index.js';

function Blog({id}){
	const
		[ blog, setBlog ] = useState({})
		, el = useRef(null)
		;

	useEffect(()=>{
		api.get(`/blog/${id}`).then(({data})=>{
			setBlog( data );
		});
	}, [id]);

	useEffect(()=>{
		let list = el.current.querySelectorAll('textarea[data-code-type]')
			;

		if( list.length ){
			createCodeEditor(list, true);
		}

		el.current.querySelectorAll('img').forEach((el)=>{
			let url = maple.url.parseUrl( el.src )
				;

			el.src = imgPath( url.path );
		});
	}, [blog]);

	return (<article className="module blog">
		<h2 className="module_title">{blog.title}</h2>
		<div className="module_content">
			<div className="blog_content"
			     ref={el}
			     dangerouslySetInnerHTML={{__html: blog.content}}></div>
			<div className="blog_datetime">{maple.util.dateFormat(new Date( blog.createDate ), 'YYYY-MM-DD hh:mm:ss')}</div>
		</div>
	</article>);
}

export default Blog;