'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, footer    = require('../footer.js')

	, profileContent = emmetTpl({
		template: 'section#score.section.profile_section' +
				'>h3{自我评估}' +
				'+div#skillRadar.radar' +
				'+div#baseRadar.radar' +
			'^^section.section.profile_section' +
				'>h3{工作经历}' +
				'+div#timeline.timeline'
	})

	, View = {
		profile: function(){
			return tpl({
				title: '个人简历 profile'
				, main: {
					moduleMain: {
						id: 'profile'
						, title: '个人简历 profile'
						, content: profileContent({})
					}
				}
				, script: {
					main: '../script/module/profile/index'
					, src: '../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = View;