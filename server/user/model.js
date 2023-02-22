import db, {DataTypes, commonAttr, commonOpts}  from '../db.js';

let User = db.define('user', {
		id: commonAttr.id
		, createDate: commonAttr.createDate

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
		, lastOnlineDate: {
			type: DataTypes.DATE
			, field: 'last_online_date'
		}
	}, {
		createdAt: commonOpts.createdAt
		, updatedAt: false
	})
	, UserInfo = db.define('user_info', {
		id: commonAttr.id

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
				return '';
			}
		}
	}, {
		createdAt: false
		, updatedAt: false
	})
	;

User.hasOne(UserInfo, {
	foreignKey: 'user_id'
	, as: 'userInfo'
	, constraints: false
});
UserInfo.belongsTo( User );

export default User;

export {
	User
	, UserInfo
};

export function userBeCreatorOf(Target, as){
	Target.belongsTo(User, {
		foreignKey: 'creator_id'
		, as: 'creator'
		, constraints: false
	});
	User.hasMany(Target, {
		foreignKey: 'creator_id'
		, as
		, constraints: false
	});
}

// export function userHasMany(Target, as){
// 	Target.belongsTo(User, {
// 		foreignKey: 'creator_id'
// 		, constraints: false
// 	});
// 	User.hasMany(Target, {
// 		foreignKey: 'creator_id'
// 		, as
// 		, constraints: false
// 	});
// }