import {prefix} from '../../config.js';

function NewsWeixin({item}){
	return (<div className={`${prefix('news')} ${prefix('news-weixin')}`}>
		{item.title}
	</div>);
}

export default NewsWeixin;