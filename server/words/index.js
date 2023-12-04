import web, {createController} from '../web.js';
import words                   from './handler.js';

createController(web, 'words', words, {
	create: 'post'
	, update: 'post'
	, changeStatus: 'post'
});