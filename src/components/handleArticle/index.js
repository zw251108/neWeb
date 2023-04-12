import maple from 'cyan-maple';

import {createCodeEditor} from '../codeEditor/index.js';
import {imgPath}          from '../../config.js';

function handleArticle(el){
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
}

export default handleArticle;