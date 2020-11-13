import db, {DataTypes, commonAttr, commonOpts} from '../db.js';

let Todo = db.define('todo', {
		...commonAttr

		, name: DataTypes.STRING
		, endDate: {
			type: DataTypes.DATE
			, field: 'end_datetime'
		}
		, tags: DataTypes.TEXT
		, desc: DataTypes.TEXT
		, status: DataTypes.INTEGER
	}, {
		...commonOpts
	})
	, Task = db.define('todo_task', {
		...commonAttr

		, todoId: {
			type: DataTypes.STRING
			, field: 'todo_id'
		}
		, name: DataTypes.STRING
		, desc: DataTypes.TEXT
		, status: DataTypes.INTEGER
	}, {
		...commonOpts
	})
	;

export default Todo;

export {
	Todo
	, Task
};