import {useState, useEffect, useRef} from 'react';

import handleArticle from '../components/handleArticle/index.js';
import api           from '../api/index.js';

function Blog({id}){
	const
		[ blog, setBlog ] = useState({
			tags: []
		})
		, el = useRef(null)
		;

	useEffect(()=>{
		api.get(`/blog/${id}`).then(({data})=>{
			setBlog( data );
		});
	}, [id]);

	useEffect(()=>{
		handleArticle( el );
	}, [blog]);

	return (<article className="module blog">
		<h2 className="module_title">{blog.title}</h2>
		<div className="module_content">
			<div className="blog_content"
			     ref={el}
			     dangerouslySetInnerHTML={{__html: blog.content}}></div>
			<div className="flex-container blog_info">
				<div className="blog_tags">
					{blog.tags.map((name)=>{
						return (<span key={name}
						              className="tag">{name}</span>);
					})}
				</div>
				<div className="blog_datetime">{blog.createDate}</div>
			</div>
		</div>
	</article>);
}

export default Blog;