'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, Model = require('./model.js')

	, articleTpl = emmetTpl({
		template: getEmmet('blog/article.html')
		, filter: {
			tags: function(d){
				return d.tags ? d.tags.split(',').map(function(d){
					return '<span class="tag">' + d +'</span>';
				}).join('') : '';
			}
		}
	})

	, View = {
		blog: function(rs){
			var blog = {
				title: '博客 blog'
				, main: {
					moduleMain: {
						id: 'blog'
						, title: '博客 blog'
						, size: 'large'
						, content: articleTpl( rs ).join('')
					}
				}
				, script: {
					main: '../script/module/blog/index'
					, src: '../script/lib/require.min.js'
				}
			};

			return tpl( blog );
		}
	}
	;