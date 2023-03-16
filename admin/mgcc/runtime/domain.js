'use strict';

import maple from 'cyan-maple';

import {baseUrl, env} from '../config.js';

const DOMAIN = ['localhost:9001', 'zw150026.com']
	, ENV = [
		'dev'
		, 'online'
	]
	, PROJECT_ALIAS = {
	}
	;
let currentDomain = baseUrl
	, currentENV = env
	, online
	;

// 若 currentENV 不在 ENV 中则认为是线上环境
if( !ENV.includes(currentENV) ){
	currentENV = 'online';
}

online = currentENV === 'online';

export default {
	env: currentENV
	, online
	, host: online ? DOMAIN[1] : DOMAIN[0]
	, cookie: online ? `.${currentDomain}` : `.${currentENV}.${currentDomain}`
	, getProject(url){
		url = maple.url.parseUrl( url );

		// let project = url.hostname.replace(currentDomain, '').split('.')[0]
		// 	;

		return {
			project: 'midway' // PROJECT_ALIAS[project] || project
			, url: url.path
		};
	}
	, assemblyUrl(target){
		return `//${this.host}${target.url}`;
	}
	, registerProjectAlias: function registerProjectAlias(project, ...aliasList){
		aliasList.forEach((alias)=>{
			if( Array.isArray(alias) ){
				registerProjectAlias(project, ...alias);
			}
			else{
				PROJECT_ALIAS[alias] = project;
			}
		});
	}
};