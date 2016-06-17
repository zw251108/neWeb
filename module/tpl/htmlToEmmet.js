'use strict';

var htmlToEmmet = function(html){
	var emmet = ''
		, tagStartExpr = /<(\w+)(\s[a-z]\w*(=("|').*\4))((\/)|(>.*<\1))>/
		, tagEnd
		;

	html = html.replace(/\t|\r|\n/g, '');



	return emmet
};