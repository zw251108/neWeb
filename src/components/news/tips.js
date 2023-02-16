import {prefix} from '../../config.js';

function NewsTips({item}){
	return (<div className={`${prefix('news')} ${prefix('news-tips')}`}>
		{item.title}
	</div>);
}

export default NewsTips;