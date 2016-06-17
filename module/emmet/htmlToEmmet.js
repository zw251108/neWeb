/**
 * @param   {object}    $   html 代码解析
 * @param   {string}    html
 * @return  {string}    html 代码转换成 emmet 的结果
 * */
;(function(factory, global, namespace){
	// 后端
	if( typeof exports === 'object' && typeof module === 'object' ){
		module.exports = factory;
	}
	// 前端 AMD 规范
	else if( typeof define === 'function' && define.amd ){
		define(factory);
	}
	else{
		global[namespace] = factory;
	}
})(function($, html){
	'use strict';

	// 清除换号 制表符
	html = html.replace(/\t|\r|\n/g, '');

	var $html = $('<template>'+ html +'</template>')
		, $children = $html.children()
		, k, i, j, t, $t
		, attribs, attr, text
		, index, $node, $temp
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
			else if( i === j ){
				t = $node.eq( j -1 )[0].next;

				if( t && t.type === 'text' ){
					emmet += '{'+ t.data +'}';
				}
			}
		}

		for(; i < j; i++ ){
			$t = $node.eq(i);
			t = $t[0];

			if( t.type === 'tag' || t.type === 'script' || t.type === 'style' ){

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

					t = $t.children()[0].prev;

					if( t && t.type === 'text' ){
						emmet += '{'+ t.data +'}';
					}

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
					text = $t.text();
					emmet += text ? '{'+ text +'}' : '';

					if( t.next && t.next.type === 'text' ){
						emmet += '+{'+ t.next.data +'}';

						if( i !== j -1 ){
							emmet += '+';

						}
					}
					else if( t.next && t.next.type === 'tag' ){
						emmet += '+';
					}
				}
			}
		}
	}

	return emmet.replace(/([^\^\+])(\+*)(\^*)$/, '$1');
}, this, 'htmlToEmmet');