import web, {createController} from '../../web.js';
import code                    from './handler.js';

createController(web, Object.entries( code ).reduce((rs, [key, value])=>{
	rs[`mg/code/${key}`] = value;

	return rs;
}, {}), {
	'mg/code/create': 'post'
	, 'mg/code/update': 'post'
});