'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')
	, menu      = require('../menu.js')
	, pagination    = require('../pagination.js')

	, resume = emmetTpl({
		template: getEmmet('user/resume.html')
	})

	, UserView = {
		resume: function(){
			return tpl({
				title: '个人简历 resume'
				, main: {
					moduleMain: {
						id: 'resume'
						, title: '个人简历 resume'
						, icon: 'user'
						, content: resume({})
					}
				}
				//, footer: {
				//	nav: menu.current('resume')
				//}
				, script: {
					main: '../script/module/user/resume'
					, src: '../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = UserView;