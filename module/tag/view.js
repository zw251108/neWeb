'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, TagView   = {
		tagEditorEmmet: getEmmet('tag/tagEditor.html')
		, tagEditorFilter: {
			tags: function(d){
				return d.tags || ''
			}
			, tagsArea: function(d){
				return d.tags ? d.tags.split(',').map(function(d){
					return '<span class="tag tag-checked">'+ d +'</span>';
				}).join('') : '';
			}
		}
	}
	;

TagView.tagEditorTpl = emmetTpl({
	template: TagView.tagEditorEmmet
	, filter: TagView.tagEditorFilter
});

module.exports = TagView;