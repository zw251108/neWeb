import web, {createController} from '../web.js';
import {formatDate}            from '../lib.js';
import {bookmark, reader}      from './handler.js';
// import tag                     from '../tag/handler.js';

createController(web, 'bookmark', bookmark, {
	share: 'post'
	, read: 'post'
	, edit: 'post'
	, retract: 'post'
});

createController(web,  'reader', reader, {
	
});