import {prefix} from '../../config.js';

function NewsBlog({item}){
	const blog = item.content
		;

	return (<article className={`${prefix('news')} ${prefix('news-blog')} grid-full`}>
		<a href={`#/blog?id=${item.targetId}`}>
			<h3 className={prefix('news-blog_title')}>{blog.title}</h3>
			<div className={prefix('news_desc')}>{blog.content}</div>
			<div className={prefix('news_datetime')}>{item.createDate}</div>
		</a>
	</article>);
}

export default NewsBlog;