import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';
import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';

let Todo = db.define('todo', {
		...commonAttr

		, name: DataTypes.STRING
		, endDate: {
			type: DataTypes.DATE
			, field: 'end_datetime'
		}
		// , tags: DataTypes.TEXT
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

userBeCreatorOf(Todo, 'todo');
userBeCreatorOf(Task, 'task');

Todo.hasMany(Task, {
	foreignKey: 'todo_id'
	, as: 'task'
	, constraints: false
});
Task.belongsTo(Todo, {
	foreignKey: 'todo_id'
	, as: 'todo'
	, constraints: false
});

tagsBelongsTo(Todo, TAG_CONTENT_TYPE.todo);

export default Todo;

export {
	Todo
	, Task
};