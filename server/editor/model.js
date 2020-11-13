import db, {DataTypes, commonAttr, commonOpts} from '../db.js';

let Editor = db.define('editor', {
		...commonAttr

		, name: DataTypes.STRING
		, imgId: {
			type: DataTypes.STRING
			, field: 'img_id'
		}

		, html: DataTypes.TEXT
		, css: DataTypes.TEXT
		, js: DataTypes.TEXT
		, cssLib: {
			type: DataTypes.TEXT
			, field: 'css_lib'
		}
		, jsLib: {
			type: DataTypes.TEXT
			, field: 'js_lib'
		}
		, includeFile: {
			type: DataTypes.TEXT
			, field: 'include_file'
		}
		, description: DataTypes.TEXT
		, tags: DataTypes.TEXT
		, editable: DataTypes.INTEGER
	}, {
		...commonOpts
	})
	, EditorTag = db.define('editor_tag', {
		id: commonAttr.id

		, editorId: {
			type: DataTypes.STRING
			, field: 'editor_id'
		}
		, tagId: {
			type: DataTypes.STRING
			, field: 'tag_id'
		}
	}, {
		createdAt: false
		, updatedAt: false
	})
	;

export default Editor;

export {
	Editor
	, EditorTag
};