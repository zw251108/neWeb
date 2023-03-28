import {where, parse}                                                        from '../db.js'
import {Planet, Continent, Country, Province, City, District, Town, Village} from './model.js';

const planet = {
		list({name, page, size}, attributes, order){
			page = parse(page, 1);
			size = parse(size, 20);

			return Planet.findAll({
				where: {
					... where.like({
						name
					})
				}
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			});
		}
		, count({id, name}){
			return Planet.count({
				where: {
					...where.eq({
						id
					})
					, ... where.like({
						name
					})
				}
			});
		}
		, create({name}){
			return Planet.create({
				name
			});
		}
		, update({id, name}){
			return Planet.update({
				name
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	, continent = {
		list({planetId, name, page, size}
		     , attributes
		     , order
		     , planetAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20);

			return Continent.findAll({
				where: {
					...where.eq({
						planetId
					})
					, ... where.like({
						name
					})
				}
				, include: [{
					model: Planet
					, as: 'planet'
					, attributes: planetAttr
				}]
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			});
		}
		, count({planetId, name}){
			return Continent.count({
				where: {
					...where.eq({
						planetId
					})
					, ... where.like({
						name
					})
				}
			});
		}
		, create({name, planetId}){
			return Continent.create({
				name
				, planetId
			});
		}
		, update({id, name, planetId}){
			return Continent.update({
				name
				, planetId
			}, {
				where: {
					...where.eq({
						id
					})
				}
			})
		}
	}
	, country = {
		list({continentId, name, code, page, size}
		     , attributes
		     , order
		     , continentAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20);

			return Country.findAll({
				where: {
					...where.eq({
						continentId
					})
					, ... where.like({
						name
						, code
					})
				}
				, include: [{
					model: Continent
					, as: 'continent'
					, attributes: continentAttr
				}]
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			});
		}
		, count({continentId, name, code}){
			return Country.count({
				where: {
					...where.eq({
						continentId
					})
					, ... where.like({
						name
						, code
					})
				}
			});
		}
		, create({name, code, continentId}){
			return Country.create({
				name
				, code
				, continentId
			});
		}
		, update({id, name, code, continentId}){
			return Country.update({
				name
				, code
				, continentId
			}, {
				where: {
					...where.eq({
						id
					})
				}
			})
		}
	}
	, province = {
		list({countryCode, name, shortname, code, telAreaCode, page, size}
		     , attributes
		     , order
		     , countryAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20);

			return Province.findAll({
				where: {
					...where.eq({
						countryCode
					})
					, ...where.or([
						where.like({
							name
						})
						, where.like([
							shortname
						])
					])
					, ...where.like({
						code
						, telAreaCode
					})
				}
				, include: [{
					model: Country
					, as: 'country'
					, attributes: countryAttr
				}]
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			});
		}
		, count({countryCode, name, shortname, code, telAreaCode}){
			return Province.count({
				where: {
					...where.eq({
						countryCode
					})
					, ...where.or([
						where.like({
							name
						})
						, where.like([
							shortname
						])
					])
					, ...where.like({
						code
						, telAreaCode
					})
				}
			});
		}
		, create({name, code, shortname, countryCode, telAreaCode}){
			return Province.create({
				name
				, code
				, shortname
				, countryCode
				, telAreaCode
			})
		}
		, update({id, name, code, shortname, countryCode, telAreaCode}){
			return Province.update({
				name
				, code
				, shortname
				, countryCode
				, telAreaCode
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	, city = {
		list({provinceCode, name, code, telAreaCode, page, size}
		     , attributes
		     , order
		     , provinceAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20);

			return City.findAll({
				where: {
					...where.eq({
						provinceCode
					})
					, ...where.like({
						name
						, code
						, telAreaCode
					})
				}
				, include: [{
					model: Province
					, as: 'province'
					, attributes: provinceAttr
				}]
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			});
		}
		, count({provinceCode, name, code, telAreaCode}){
			return City.count({
				where: {
					...where.eq({
						provinceCode
					})
					, ...where.like({
						name
						, code
						, telAreaCode
					})
				}
			});
		}
		, create({name, code, provinceCode, telAreaCode}){
			return Province.create({
				name
				, code
				, provinceCode
				, telAreaCode
			})
		}
		, update({id, name, code, provinceCode, telAreaCode}){
			return Province.update({
				name
				, code
				, provinceCode
				, telAreaCode
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	, district = {
		list({cityCode, name, code, page, size}
		     , attributes
		     , order
		     , cityAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20);

			return District.findAll({
				where: {
					...where.eq({
						cityCode
					})
					, ...where.like({
						name
						, code
					})
				}
				, include: [{
					model: City
					, as: 'city'
					, attributes: cityAttr
				}]
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			});
		}
		, count({cityCode, name, code}){
			return District.count({
				where: {
					...where.eq({
						cityCode
					})
					, ...where.like({
						name
						, code
					})
				}
			});
		}
		, create({name, code, cityCode}){
			return Province.create({
				name
				, code
				, cityCode
			})
		}
		, update({id, name, code, cityCode}){
			return Province.update({
				name
				, code
				, cityCode
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	, town = {
		list({districtCode, name, code, page, size}
		     , attributes
		     , order
		     , districtAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20);

			return Town.findAll({
				where: {
					...where.eq({
						districtCode
					})
					, ...where.like({
						name
						, code
					})
				}
				, include: [{
					model: District
					, as: 'district'
					, attributes: districtAttr
				}]
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			});
		}
		, count({districtCode, name, code}){
			return Town.count({
				where: {
					...where.eq({
						districtCode
					})
					, ...where.like({
						name
						, code
					})
				}
			});
		}
		, create({name, code, districtCode}){
			return Province.create({
				name
				, code
				, districtCode
			})
		}
		, update({id, name, code, districtCode}){
			return Province.update({
				name
				, code
				, districtCode
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	, village = {
		list({townCode, name, code, type, page, size}
		     , attributes
		     , order
		     , townAttr=['id', 'name']){

			page = parse(page, 1);
			size = parse(size, 20);

			return Village.findAll({
				where: {
					...where.eq({
						townCode
						, type
					})
					, ...where.like({
						name
						, code
					})
				}
				, include: {
					model: Town
					, as: 'town'
					, attributes: townAttr
				}
				, offset: (page -1)* size
				, limit: size
				, attributes
				, order
			});
		}
		, count({townCode, name, code, type}){
			return Village.count({
				where: {
					...where.eq({
						townCode
						, type
					})
					, ...where.like({
						name
						, code
					})
				}
			})
		}
		, create({name, code, townCode}){
			return Province.create({
				name
				, code
				, townCode
			})
		}
		, update({id, name, code, townCode}){
			return Province.update({
				name
				, code
				, townCode
			}, {
				where: {
					...where.eq({
						id
					})
				}
			});
		}
	}
	;

export default {
	planet
	, continent
	, country
	, province
	, city
	, district
	, town
	, village
};

export {
	planet
	, continent
	, country
	, province
	, city
	, district
	, town
	, village
};