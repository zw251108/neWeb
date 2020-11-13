import db, {DataTypes, commonAttr, commonOpts}  from '../db.js';

let Document = db.define('document', {
		...commonAttr

		, title: DataTypes.STRING
		, sectionOrder: {
			type: DataTypes.TEXT
			, field: 'section_order'
		}
	}, {
		...commonOpts
	})
	, Section = db.define('document_section', {
		...commonAttr

		, title: DataTypes.STRING
		, documentId: {
			type: DataTypes.STRING
			, field: 'document_id'
		}
		, contentOrder: {
			type: DataTypes.TEXT
			, field: 'content_order'
		}
		, order: DataTypes.INTEGER
	}, {
		...commonOpts
	})
	, Content = db.define('document_content', {
		...commonAttr

		, title: DataTypes.STRING
		, content: DataTypes.TEXT
		, documentId: {
			type: DataTypes.STRING
			, field: 'document_id'
		}
		, sectionId: {
			type: DataTypes.STRING
			, field: 'section_id'
		}
		// , sectionTitle
		, order: DataTypes.INTEGER
		// , type
		// , typeName
	}, {
		...commonOpts
	})
	;

export default Document;

export {
	Document
	, Section
	, Content
};