import db, {DataTypes, commonAttr} from '../../db.js';

let Code = db.define('mg_code', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, code: DataTypes.STRING
		, type: DataTypes.INTEGER
		, description: DataTypes.STRING
		, createTime: {
			type: DataTypes.DATE
			, field: 'create_time'
			, defaultValue: DataTypes.NOW
		}
		, updateTime: {
			type: DataTypes.DATE
			, field: 'update_time'
			, defaultValue: DataTypes.NOW
		}
	}, {
		createdAt: 'create_time'
		, updatedAt: 'update_time'
	})
	, CodeLog = db.define('mg_code_log', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, codeId: {
			type: DataTypes.INTEGER
			, field: 'code_id'
		}
		, lastVersion: {
			type: DataTypes.STRING
			, field: 'last_version'
		}
		, lastDesc: {
			type: DataTypes.STRING
			, field: 'last_desc'
		}
		, currVersion: {
			type: DataTypes.STRING
			, field: 'curr_version'
		}
		, currDesc: {
			type: DataTypes.STRING
			, field: 'curr_desc'
		}
		, createTime: {
			type: DataTypes.DATE
			, field: 'create_time'
			, defaultValue: DataTypes.NOW
		}
	}, {
		createdAt: 'create_time'
		, timestamps: false
	})
	;

export default Code;

export {
	CodeLog
};