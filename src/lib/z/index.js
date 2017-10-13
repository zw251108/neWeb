'use strict';

import maple    from 'maple';

let z = maple
	;

import * as api from './api/index.js';

z.api = api;

import './biz/interceptor.js';

export default z;
