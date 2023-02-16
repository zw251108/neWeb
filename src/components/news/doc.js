import {prefix} from '../../config.js';

function NewsDoc({item}){
	return (<div className={`${prefix('news')} ${prefix('news-doc')}`}>
		{item.title}
	</div>);
}

export default NewsDoc;