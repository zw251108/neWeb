import web, {createController}                                                                 from '../web.js';
import {planet, continent, country, province, city, district, town, village}                    from './handler.js';

createController(web, 'data/planet', planet, {
	create: 'post'
	, update: 'post'
});
createController(web, 'data/continent', continent, {
	create: 'post'
	, update: 'post'
});
createController(web, 'data/country', country, {
	create: 'post'
	, update: 'post'
});
createController(web, 'data/province', province, {
	create: 'post'
	, update: 'post'
});
createController(web, 'data/city', city, {
	create: 'post'
	, update: 'post'
});
createController(web, 'data/district', district, {
	create: 'post'
	, update: 'post'
});
createController(web, 'data/town', town, {
	create: 'post'
	, update: 'post'
});
createController(web, 'data/village', village, {
	create: 'post'
	, update: 'post'
});