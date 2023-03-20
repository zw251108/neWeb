import web, {createController} from '../../web.js';
import code                    from './handler.js';

createController(web, 'mg/code', code, {
	'create': 'post'
	, 'update': 'post'
});