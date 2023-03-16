import web, {createController} from '../../web.js';
import page                    from './handler.js';

createController(web, Object.entries( page ).reduce((rs, [key, value])=>{
	rs[`mg/page/${key}`] = value;

	return rs;
}, {}), {
	'mg/page/create': 'post'
	, 'mg/page/update': 'post'
	, 'mg/page/changeState': 'post'
});