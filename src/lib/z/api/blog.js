'use strict';

import Model        from '../model/model.js';
import ServiceModel from '../model/service.js';

class BlogServiceModel extends ServiceModel{
	constructor(config){
		super( config );
	}

	/**
	 * @summary 获取博客列表
	 * @param   {Object}    data
	 * @param   {Number}    data.page
	 * @param   {Number}    data.size
	 * @param   {String}    data.keyword
	 * @param   {String}    data.tags
	 * @return  {Promise}
	 * */
	getBlogList(data){
		return this.getData('/blog/', {
			data
		});
	}
	/**
	 * @summary 获取博客文章
	 * @param   {Number}    blogId
	 * @return  {Promise}
	 * */
	getBlog(blogId){
		return this.getData('/blog/'+ blogId);
	}
}

Model.register('blog', BlogServiceModel);

export default BlogServiceModel;