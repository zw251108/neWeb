import db, {DataTypes, commonAttr} from '../../db.js';

const Page = db.define('mg_page', {
		id: commonAttr.id
		, path: DataTypes.STRING
		, menu: DataTypes.STRING
		, project: DataTypes.STRING
		, description: DataTypes.STRING
		, state: DataTypes.INTEGER
		, config: DataTypes.STRING
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
	, PageLog = db.define('mg_page_log', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, pageId: {
			type: DataTypes.INTEGER
			, field: 'page_id'
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

export default Page;

export {
	PageLog
};