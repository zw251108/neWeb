import db, {DataTypes, commonAttr, commonOpts} from '../db.js';
import {userBeCreatorOf}                       from '../user/model.js';
import {tagsBelongsTo, TAG_CONTENT_TYPE}       from '../tag/model.js';
import {imagesBelongsTo, IMAGE_CONTENT_TYPE}   from '../image/model.js';

let Document = db.define('document', {
		...commonAttr

		, title: DataTypes.STRING
		, sectionOrder: {
			type: DataTypes.TEXT
			, field: 'section_order'
		}
		, status: DataTypes.INTEGER
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
		, status: DataTypes.INTEGER
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
		, status: DataTypes.INTEGER
	}, {
		...commonOpts
	})
	;

userBeCreatorOf(Document, 'document');
userBeCreatorOf(Section, 'section');
userBeCreatorOf(Content, 'content');

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
Content.belongsTo(Document, {
	foreignKey: 'document_id'
	, as: 'document'
	, constraints: false
});
Document.hasMany(Content, {
	foreignKey: 'document_id'
	, as: 'content'
	, constraints: false
});

tagsBelongsTo(Document, TAG_CONTENT_TYPE.document);

imagesBelongsTo(Document, IMAGE_CONTENT_TYPE.document);

export default Document;

export {
	Document
	, Section
	, Content
};