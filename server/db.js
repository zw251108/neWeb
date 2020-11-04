import Sequelize  from 'sequelize';

import CONFIG       from '../config.js'

const {DB}  = CONFIG
	, {DataTypes} = Sequelize
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