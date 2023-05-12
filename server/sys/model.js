import db, {DataTypes, commonAttr, commonOpts} from '../db.js';

let SysConfig = db.define('sys_config', {
		id: commonAttr.id
		, createDate: commonAttr.createDate
		, updateDate: commonAttr.updateDate

		, name: DataTypes.STRING
		, config: DataTypes.STRING
		, description: DataTypes.STRING
	}, {
		...commonOpts
	})
	;

export default SysConfig;