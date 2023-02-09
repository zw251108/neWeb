import {prefix} from '../../config.js';

function NewsWeibo({item}){
	return (<div className={`${prefix('news')} ${prefix('news-weibo')}`}>
		{item.title}
	</div>);
}

export default NewsWeibo;