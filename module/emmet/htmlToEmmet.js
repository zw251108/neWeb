'use strict';

var Cheerio = require('cheerio')
	, fs = require('fs')
	;

var createEmmet = function(html){
	var $html = Cheerio.load('<template>'+ html +'</template>')
		, $children = $html('template').children()
		, k, i, j, t, $t
		, attribs, attr
		, index, $node
		, cache = [{
			$node: $children
			, index: 0
		}]
		, emmet = ''
		;

	while( cache.length ){

		index = cache.pop();
		$node = index.$node;

		i = index.index;
		j = $node.length;

		if( i > 0 ){
			if( cache.length || i !== j ){
				emmet += '^';
			}
		}

		for(; i < j; i++ ){
			$t = $node.eq(i);

			if( $t[0].type == 'tag' ){

				t = $t[0];
				attribs = t.attribs;

				emmet += t.name;

				if( 'id' in attribs ){
					emmet += '#'+ attribs['id'];
				}
				if( 'class' in attribs ){
					emmet += '.'+ attribs['class'].split(' ').join('.');
				}

				attr = [];
				for(k in attribs) if( attribs.hasOwnProperty(k) && k !== 'id' && k !== 'class' ){
					attr.push( k +(attribs[k] ? '='+ attribs[k] : '') );
				}

				emmet += attr.length ? '['+ attr.join(' ') +']' : '';

				if( $t.children().length ){

					emmet += '>';

					cache.push({
						$node: $node
						, index: i+1
					}, {
						$node: $t.children()
						, index: 0
					});

					break;
				}
				else{
					if( i !== j -1 ) emmet += '+';
				}
			}
		}
	}

	return emmet;
};

module.exports = createEmmet;