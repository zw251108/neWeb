import Sequelize  from 'sequelize';

import CONFIG       from '../config.js'

const {DB}  = CONFIG
	, {DataTypes, Op} = Sequelize
	, db = new Sequelize({
		...DB
	
		, dialect: 'mysql'
		, define: {
			freezeTableName: true
		}
	})
	;

export default db;

export {
	DataTypes
	, Op
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

export const TAG_CONTENT_TYPE = {
	favorite: 0
	, blog: 1
	, document: 2
	, editor: 3
	, todo: 4
	, reader: 5
	, bookmark: 6
	, image: 7
	, book: 8
	, movie: 9
	, game: 10
	, album: 11
};