import Sequelize  from 'sequelize';

import CONFIG       from '../config.js'

const {DB}  = CONFIG
	, {DataTypes} = Sequelize
	, db = new Sequelize(DB.database, DB.username, DB.password, {
		host: DB.host
		, port: DB.port
		, dialect: 'mysql'
		, define: {
			freezeTableName: true
		}
	})
	;
console.log(DB, DB.database)
export default db;

export {
	DataTypes
};