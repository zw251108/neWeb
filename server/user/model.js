import db, {DataTypes}  from '../db.js';

let User = db.define('user', {
	id: {
		type: DataTypes.INTEGER
		, autoIncrement: true
		, primaryKey: true
	}
	, email: DataTypes.STRING
	, phone: DataTypes.STRING
	, username: DataTypes.STRING
	, password: DataTypes.STRING
	, token: DataTypes.STRING
	, avatar: DataTypes.STRING
	, description: DataTypes.STRING
	, lv: {
		type: DataTypes.INTEGER
		, defaultValue: 1
	}
	, power: {
		type: DataTypes.INTEGER
		, defaultValue: 0
	}
	, onlineStatus: {
		type: DataTypes.INTEGER
		, field: 'online_status'
	}
	, groupBelong: {
		type: DataTypes.STRING
		, field: 'group_belong'
	}
	, usableMod: {
		type: DataTypes.TEXT
		, field: 'usable_mod'
	}
	, lastOnlineDate: DataTypes.DATE
});

export default User;