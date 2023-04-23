import maple from 'cyan-maple';

import {createCodeEditor} from '../codeEditor/index.js';
import {imgPath}          from '../../config.js';

function handleImg(el){
	let url = maple.url.parseUrl( el.src )
		;

	el.src = imgPath( url.path );
}

function handleArticle(ref){
	let list = ref.current.querySelectorAll('textarea[data-code-type]')
		;

	if( list.length ){
		createCodeEditor(list, true);
	}

	ref.current.querySelectorAll('img').forEach( handleImg );
}

export default handleArticle;

export {
	handleImg
};