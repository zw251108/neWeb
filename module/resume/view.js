'use strict';

var getEmmet    = require('../emmet/getEmmet.js')
	, tpl       = require('../emmet/tpl.js')

	, emmetTpl  = require('../emmetTpl/emmetTpl.js').template

	, modules   = require('../module.js')

	, resumeContent = emmetTpl({
		template: 'section#score.section.resume_section' +
				'>h3{自我评估}' +
				'+div#skillRadar.radar' +
				'+div#baseRadar.radar' +
			'^^section.section.resume_section' +
				'>h3{工作经历}' +
				'+div#timeline.timeline'
	})

	, View = {
		resume: function(){
			return tpl({
				title: '个人简历 resume'
				, main: {
					moduleMain: {
						id: 'resume'
						, title: '个人简历 resume'
						, content: resumeContent({})
					}
				}
				//, footer: {
				//	nav: modules.current('resume')
				//}
				, script: {
					main: '../script/module/resume/index'
					, src: '../script/lib/require.min.js'
				}
			});
		}
	}
	;

module.exports = View;