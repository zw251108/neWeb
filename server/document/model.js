import db, {DataTypes, commonAttr, commonOpts}  from '../db.js';
import {userHasMany}    from '../user/model.js';

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

userHasMany(Document, 'document');
userHasMany(Section, 'section');
userHasMany(Content, 'content');

Section.belongsTo(Document, {
	foreignKey: 'document_id'
	, as: 'document'
	, constraints: false
});
Document.hasMany(Section, {
	foreignKey: 'document_id'
	, as: 'section'
	, constraints: false
});

Content.belongsTo(Section, {
	foreignKey: 'section_id'
	, as: 'section'
	, constraints: false
});
Section.hasMany(Content, {
	foreignKey: 'section_id'
	, as: 'content'
	, constraints: false
});

export default Document;

export {
	Document
	, Section
	, Content
};