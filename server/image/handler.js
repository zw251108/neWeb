import multer from 'multer';

import CONFIG from '../../config.js';

import {where, parse}             from '../db.js';
import {Image, Album, AlbumImage} from './model.js';
import News                       from '../news/model.js';

const album = {
		list({creatorId, page, size}
		     , attributes
		     , order=[['id', 'DESC']]){

			page = parse(page, 1);
			size = parse(size, 20)

			return Album.findAll({
				where: {
					...where.eq({
						creatorId
					})
				}
				, offset: (page -1)* size
				, limit: size
				, order
			})
		}
		, count({creatorId}){
			return Album.count({
				where: {
					...where.eq({
						creatorId
					})
				}
			});
		}
		, get({id, includeImage=true}, attributes, imageAttr){
			return Album.findOne({
				where: {
					...where.eq({
						id
					})
				}
				, include: includeImage ? [{
					model: Image
					, as: 'image'
					, attributes: imageAttr
				}] : undefined
				, attributes
			});
		}
		, create({name, desc, tags}){
			return Album.create({
				name
				, desc
				, tags
				, creatorId: 1
			});
		}
		, update({id, name, desc, tags}){
			return Album.update({
				name
				, desc
				, tags
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	, image = {
		list({albumId, creatorId, page, size}
		     , attributes
		     , order=[['id', 'DESC']]
		     , albumAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20)

			return Image.findAll({
				where: {
					...where.eq({
						creatorId
					})
				}
				, include: [{
					model: Album
					, as: 'album'
					, attributes: albumAttr
					, where: albumId ? {
						...where.eq({
							id: albumId
						})
					}: undefined
					, through: {
						attributes: []
					}
				}]
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			})
		}
		, getNext({id, albumId, creatorId, size}
		          , attributes
		          , order=[['id', 'ASC']]
		          , albumAttr=[['id', 'name']]){

			size = parse(size, 1);

			return Image.findAll({
				where: {
					...where.gt({
						id
					})
				}
				, include: [{
					model: Album
					, as: 'album'
					, attributes: albumAttr
					, where: albumId ? {
						...where.eq({
							id: albumId
						})
					}: undefined
					, through: {
						attributes: []
					}
				}]
				, limit: size
				, attributes
				, order
			})
		}
		, getPrev({id, albumId, creatorId, size}
		          , attributes
		          , order=[['id', 'DESC']]
		          , albumAttr=[['id', 'name']]){

			size = parse(size, 1);

			return Image.findAll({
				where: {
					...where.lt({
						id
					})
				}
				, include: [{
					model: Album
					, as: 'album'
					, attributes: albumAttr
					, where: albumId ? {
						...where.eq({
							id: albumId
						})
					}: undefined
					, through: {
						attributes: []
					}
				}]
				, limit: size
				, attributes
				, order
			})
		}
		, count({albumId, creatorId}){
			return Image.count({
				where: {
					...where.eq({
						creatorId
					})
				}
				, include: [{
					model: Album
					, as: 'album'
					, attributes: []
					, where: albumId ? {
						...where.eq({
							id: albumId
						})
					}: undefined
					, through: {
						attributes: []
					}
				}]
			});
		}
		, get({id}, attributes){
			return Image.findOne({
				where: {
					...where.eq({
						id
					})
				}
				, attributes
			});
		}
		// , create({src, width, height, desc, tags}){
		// 	return Image.create({
		// 		src
		// 		, width
		// 		, height
		// 		, tags
		// 		, desc
		// 	});
		// }
		, update({id, name, desc, tags}){
			return Image.update({
				name
				, desc
				, tags
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	, uploadMiddleware  = multer({
		storage: multer.diskStorage({
			destination(req, file, callback){
				callback(null, CONFIG.UPLOAD_DIR);
			}
			, filename(req, file, callback){
				let name = file.originalname.split('.')
					;

				// todo 生成文件名
				callback(null, `${Date.now()}${Math.random().toString(36).slice(2,9)}.${name[name.length-1].toLowerCase()}`);
			}
		})
	})
	, upload = function(req){
		let { width
			, height
			, desc
			, tags
			, albumId
			, status } = req.body || {}
			, file = req.file
			, execute
			;

		if( file ){
			let src = '/'+ file.path.replace(/\\/g, '/')
				;

			execute = Image.create({
				src
				, width
				, height
				, desc
				, tags
				, creatorId: 1
			}).then((data)=>{
				let { id: targetId } = data

				return News.create({
					type: 'img'
					, targetId
					, content: {
						src
						, width
						, height
						, desc
					}
					, status
					, creatorId: 1
				}).then(()=>{
					return data;
				});
			});

			if( albumId ){
				execute = execute.then((data)=>{
					let { id: imageId } = data
						;

					return Promise.all([
						AlbumImage.create({
							albumId
							, imageId
						})
						, Album.increment({
							num: 1
						}, {
							where: {
								...where.eq({
									id: albumId
								})
							}
						})
					]).then(()=>{
						return data;
					})
				});
			}
		}
		else{
			execute = Promise.reject( new Error('没有文件上传') );
		}

		return execute;
	}
	, uploads = function(req){
		let { info } = req.body || {}
			, files = req.files
			, albumId
			, status
            ;

		info = JSON.parse( info || '[]' );
		albumId = info[0].albumId;
		status = info[0].status;

		return Promise.all( files.map((file, index)=>{
			let src = '/'+ file.path.replace(/\\/g, '/')
				,
				{ width
				, height
				, desc
				, tags
				, albumId } = info[index] || {}
				, execute = Image.create({
					src
					, width
					, height
					, desc
					, tags
					, creatorId: 1
				})
				;

			if( albumId ){
				execute = execute.then((data)=>{
					let { id: imageId } = data
						;

					return AlbumImage.create({
						albumId
						, imageId
					}).then(()=>{
						return data;
					});
				});
			}

			return execute;
		}) ).then((data)=>{
			return Promise.all([
				News.create({
					type: 'album'
					, targetId: albumId
					, content: data.map(({id, src, width, height, desc})=>{
						return {
							id
							, src
							, width
							, height
							, desc
						};
					})
					, status
					, creatorId: 1
				})
				, albumId ? Album.increment({
					num: data.length
				}, {
					where: {
						...where.eq({
							id: albumId
						})
					}
				}) : null
			]).then(()=>{
				return data;
			});
		});
	}
	;

export default {
	album
	, image
	, uploadMiddleware
	, upload
	, uploads
};

export {
	album
	, image
	, uploadMiddleware
	, upload
	, uploads
};