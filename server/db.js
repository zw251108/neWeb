import Sequelize  from 'sequelize';

import CONFIG       from '../config.js'

const
	{ DB }  = CONFIG
	,
	{ DataTypes, Op } = Sequelize
	, db = new Sequelize({
		...DB
	
		, dialect: 'mysql'
		, define: {
			freezeTableName: true
		}
	})
	, where = {
		and(params){
			let empty = params.every((param)=>{
					return !Object.keys( param ).length;
				})
				;

			return !empty ? {
				[Op.and]: params
			} : {};
		}
		, or(params){
			let empty = params.every((param)=>{
					return !Object.keys( param ).length;
				})
				;

			return !empty ? {
				[Op.or]: params
			} : {};
		}
		, eq(params){
			return Object.entries( params ).reduce((rs, [key, val])=>{
				if( val !== undefined && val !== '' && val !== null ){
					rs[key] = {
						[Op.eq]: val
					};
				}

				return rs;
			}, {});
		}
		, like(params){
			return Object.entries( params ).reduce((rs, [key, val])=>{
				if( val !== undefined && val !== '' ){
					rs[key] = {
						[Op.like]: `%${val}%`
					};
				}

				return rs;
			}, {});
		}
		, in(params){
			return Object.entries( params ).reduce((rs, [key, val])=>{
				if( Array.isArray(val) && val.length ){
					rs[key] = {
						[Op.in]: val
					};
				}

				return rs;
			}, {});
		}
		, notIn(params){
			return Object.entries( params ).reduce((rs, [key, val])=>{
				if( Array.isArray(val) && val.length ){
					rs[key] = {
						[Op.notIn]: val
					};
				}

				return rs;
			}, {});
		}
	}
	, parse = (val, def)=>{
		try{
			return JSON.parse( val );
		}
		catch(e){
			return def;
		}
	}
	, literal = (str)=>{
		return db.literal( str );
	}
	;

export default db;

export {
	DataTypes
	, Op
	, where
	, parse
	, literal
};

export const commonAttr = {
	id: {
		type: DataTypes.INTEGER
		, autoIncrement: true
		, primaryKey: true
	}
	, creatorId: {
		type: DataTypes.INTEGER
		, field: 'creator_id'
	}
	, createDate: {
		type: DataTypes.DATE
		, field: 'create_datetime'
		, defaultValue: DataTypes.NOW
	}
	, updateDate: {
		type: DataTypes.DATE
		, field: 'update_datetime'
		, defaultValue: DataTypes.NOW
	}
};
export const commonOpts = {
	createdAt: 'create_datetime'
	, updatedAt: 'update_datetime'
};