import {ServiceModel} from 'cyan-maple';

const api = new ServiceModel({
		baseUrl: '//localhost:9001'
		, resource: {
			news: '/news'
			, blog: '/blog'
		}
	})
	;

export default api;