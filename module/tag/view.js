'use strict';

var getEmmet  = require('../emmet/getEmmet.js')
	, View  = {
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

module.exports = View;