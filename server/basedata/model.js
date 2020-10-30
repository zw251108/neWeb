import db, {DataTypes}  from '../db.js';

let Planet = db.define('basedata_add_planet', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
	})
	, Continent = db.define('basedata_add_country', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, planet: DataTypes.STRING
	})
	, Country = db.define('basedata_add_country', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, continent: DataTypes.STRING
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
		, country: DataTypes.STRING
		, telAreaCode: {
			type: DataTypes.STRING
			, field: 'tel_area_code'
		}
	})
	, City = db.define('basedata_add_city', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, province: DataTypes.STRING
		, telAreaCode: {
			type: DataTypes.STRING
			, field: 'tel_area_code'
		}
	})
	, District = db.define('basedata_add_district', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, city: DataTypes.STRING
	})
	, Town = db.define('base_add_town', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, district: DataTypes.STRING
	})
	, Village = db.define('base_add_village', {
		id: {
			type: DataTypes.INTEGER
			, autoIncrement: true
			, primaryKey: true
		}
		, name: DataTypes.STRING
		, code: DataTypes.STRING
		, town: DataTypes.STRING
		, type: DataTypes.STRING
	})
	;

Planet.hasMany(Continent, {
	foreignKey: 'planet'
	, as: 'continent'
	, constraints: false
});
Continent.hasMany(Country, {
	foreignKey: 'continent'
	, as: 'country'
	, constraints: false
});
Province.hasMany(Country, {
	foreignKey: 'country'
	, as: 'province'
	, constraints: false
});
City.hasMany(District, {
	foreignKey: 'city'
	, as: 'district'
	, constraints: false
});
District.hasMany(Town, {
	foreignKey: 'district'
	, as: 'town'
	, constraints: false
});
Town.hasMany(Village, {
	foreignKey: 'town'
	, as: 'village'
	, constraints: false
});

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