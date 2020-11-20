import {Planet, Continent, Country, Province, City, District, Town, Village} from './model.js';

export default {
	getPlanet(where){
		return Planet.findAll({
			where
		});
	}
};