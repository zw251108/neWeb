import {prefix} from '../../config.js';

function NewsBlog({item}){
	return (<article className={`${prefix('news')} ${prefix('news-blog')}`}>
		<h3 className={prefix('news-blog_title')}>{item.title}</h3>
		<div className={prefix('news-blog_desc')}>{item.desc}</div>
	</article>);
}

export default NewsBlog;