'use strict';

import {baseUrl} from '../config.js';
// import domain from '../runtime/domain.js';

import {ServiceModel} from 'cyan-maple';

const PROJECT = 'auth'
	;

class AuthService extends ServiceModel{
	get LOGIN_PATH(){
		return `${this.config.baseUrl}/login.html`;
	}

	get NOT_LOGIN_CODE(){
		return 401;
	}
}

export default new AuthService({
	baseUrl: baseUrl
	, resource: {
		// changePwd: '/privates/user/updatePwd'
	}
});

export {
	AuthService
};