import {prefix} from '../../config.js';

function NewsImg({item}){
	return (<div className={`${prefix('news')} ${prefix('news-img')}`}>
		<img src={item.src}
		     alt={item.title}/>
	</div>);
}

export default NewsImg;