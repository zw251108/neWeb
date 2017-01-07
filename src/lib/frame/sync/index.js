'use strict';

import ModelSync from './modelSync';

import ModelReqSync from './modelReqSync';

export default {
	makeModelSync(from, to){
		return new ModelSync(from, to);
	}
	, makeModelReqSync(req, model){
		return new ModelReqSync(req, model)
	}

	, modelSync: ModelSync
	, modelReqSync: ModelReqSync
};