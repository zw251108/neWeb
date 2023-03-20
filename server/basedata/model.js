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
	, Continent = db.define('basedata_add_continent', {
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
	, Town = db.define('basedata_add_town', {
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
	, Village = db.define('basedata_add_village', {
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

Continent.belongsTo(Planet, {
	foreignKey: 'planet_id'
	, as: 'planet'
	, constraints: false
});
Planet.hasMany(Continent, {
	foreignKey: 'planet_id'
	, as: 'continent'
	, constraints: false
});

Country.belongsTo(Continent, {
	foreignKey: 'continent_id'
	, as: 'continent'
	, constraints: false
});
Continent.hasMany(Country, {
	foreignKey: 'continent_id'
	, as: 'country'
	, constraints: false
});

Province.belongsTo(Country, {
	foreignKey: 'country_code'
	, targetKey: 'code'
	, as: 'country'
	, constraints: false
});
Country.hasMany( Province, {
	foreignKey: 'country_code'
	, sourceKey: 'code'
	, as: 'province'
	, constraints: false
} );

City.belongsTo(Province, {
	foreignKey: 'province_code'
	, targetKey: 'code'
	, as: 'province'
	, constraints: false
});
Province.hasMany(City, {
	foreignKey: 'province_code'
	, sourceKey: 'code'
	, as: 'city'
	, constraints: false
});

District.belongsTo(City, {
	foreignKey: 'city_code'
	, targetKey: 'code'
	, as: 'city'
	, constraints: false
});
City.hasMany(District, {
	foreignKey: 'city_code'
	, sourceKey: 'code'
	, as: 'district'
	, constraints: false
});

Town.belongsTo(District, {
	foreignKey: 'district_code'
	, targetKey: 'code'
	, as: 'district'
	, constraints: false
});
District.hasMany(Town, {
	foreignKey: 'district_code'
	, sourceKey: 'code'
	, as: 'town'
	, constraints: false
});

Village.belongsTo(Town, {
	foreignKey: 'town_code'
	, targetKey: 'code'
	, as: 'town'
	, constraints: false
})
Town.hasMany(Village, {
	foreignKey: 'town_code'
	, sourceKey: 'code'
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