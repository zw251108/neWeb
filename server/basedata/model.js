import db, {DataTypes}  from '../db.js';

let Planet = db.define('basedata_add_planet', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
	}, {
		createdAt: false
		, updatedAt: false
	})
	, Continent = db.define('basedata_add_country', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, planetId: {
			type: DataTypes.STRING
			, field: 'planet_id'
		}
	}, {
		createdAt: false
		, updatedAt: false
	})
	, Country = db.define('basedata_add_country', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, continentId: {
			type: DataTypes.STRING
			, field: 'continent_id'
		}
	}, {
		createdAt: false
		, updatedAt: false
	})
	, Province = db.define('basedata_add_province', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, shortname: DataTypes.STRING
		, countryCode: {
			type: DataTypes.STRING
			, field: 'country_code'
		}
		, telAreaCode: {
			type: DataTypes.STRING
			, field: 'tel_area_code'
		}
	}, {
		createdAt: false
		, updatedAt: false
	})
	, City = db.define('basedata_add_city', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, provinceCode: {
			type: DataTypes.STRING
			, field: 'province_code'
		}
		, telAreaCode: {
			type: DataTypes.STRING
			, field: 'tel_area_code'
		}
	}, {
		createdAt: false
		, updatedAt: false
	})
	, District = db.define('basedata_add_district', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, cityCode: {
			type: DataTypes.STRING
			, field: 'city_code'
		}
	}, {
		createdAt: false
		, updatedAt: false
	})
	, Town = db.define('base_add_town', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, districtCode: {
			type: DataTypes.STRING
			, field: 'district_code'
		}
	}, {
		createdAt: false
		, updatedAt: false
	})
	, Village = db.define('base_add_village', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, townCode: {
			type: DataTypes.STRING
			, field: 'town_code'
		}
		, type: DataTypes.STRING
	}, {
		createdAt: false
		, updatedAt: false
	})
	;

let BaseData = {
		Planet
		, Continent
		, Country
		, Province
		, City
		, District
		, Town
		, Village
	}
	;

export default BaseData;

export {
	Planet
	, Continent
	, Country
	, Province
	, City
	, District
	, Town
	, Village
};