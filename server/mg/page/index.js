import web, {createController} from '../../web.js';
import page                    from './handler.js';

createController(web, 'mg/page', page, {
	create: 'post'
	, update: 'post'
	, changeState: 'post'
});