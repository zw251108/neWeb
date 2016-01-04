'use strict';

var Document = {
	handleData: function(documentData){
		var document = documentData[0]
			, section = documentData[1]
			, content = documentData[2]

			, sectionIndex = {}
			, contentIndex = {}
			, sectionOrder = document.section_order.split(',')
			, contentOrder
			, i, j, t, x
			, m, n

			, result = []
			, obj
			;

		i = content.length;
		while( i-- ){
			t = content[i];

			contentIndex[t.id] = t;
		}

		i = section.length;
		while( i-- ){
			t = section[i];

			sectionIndex[t.id] = t;
		}

		for(i = 0, j = sectionOrder.length; i < j; i++ ){
			t = sectionIndex[sectionOrder[i]];

			obj = {
				sectionId: t.id
				, sectionTitle: t.title
			};

			contentOrder = t.content_order.split(',');

			t = [];
			for(m = 0, n = contentOrder.length; m < n; m++ ){
				x = contentIndex[contentOrder[m]];

				t.push( x );
			}

			obj.sectionList = t;

			result.push( obj );
		}

		return result;
	}
};

module.exports = Document;