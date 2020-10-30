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
	})
	, UserInfo = db.define('user_info', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, userId: {
			type: DataTypes.STRING
			, field: 'user_id'
		}
		, realName: {
			type: DataTypes.STRING
			, field: 'real_name'
		}
		, idNumber: {
			type: DataTypes.STRING
			, field: 'id_number'
		}
		, addressCountry: {
			type: DataTypes.STRING
			, field: 'address_country'
		}
		, addressProvince: {
			type: DataTypes.STRING
			, field: 'address_province'
		}
		, addressCity: {
			type: DataTypes.STRING
			, field: 'address_city'
		}
		, addressDistrict: {
			type: DataTypes.STRING
			, field: 'address_district'
		}
		, addressTown: {
			type: DataTypes.STRING
			, field: 'address_town'
		}
		, addressVillage: {
			type: DataTypes.STRING
			, field: 'address_village'
		}
		, addressDetail: {
			type: DataTypes.STRING
			, field: 'address_detail'
		}
		, address: {
			type: DataTypes.VIRTUAL
			, get(){

			}
		}
	})
	;



export default User;

export {
	User
	, UserInfo
};