/**
 * @module config
 * */
define({
	// requireConfig: {
		paths: {
			jquery: 'lib/jquery.min'
			// , text: 'lib/text'
			// , css: 'lib/css'
			, d3: 'lib/d3.min'

			, template: 'ui/jquery.emmetTpl'
			, layout: 'ui/jquery.layout'
			, pagination: 'ui/jquery.pagination'

			, global: 'module/global'
			//, popup: 'module/popup'
			, socket: 'module/socket'
			, tag: 'module/tag'
			, time: 'module/time'
			, storage: 'module/storage'

			, notice: 'module/notification'

			, header: 'module/header'

			, msgPopup: 'module/msg.popup'

			, login: 'module/login'

			, searchBar: 'module/searchBar'
			, filterBox: 'module/filterBox'
			, codeEditor: 'module/codeEditor'
			, codeEditorSkin: 'module/codeEditorSkin'

			, blog: 'module/blog/blog'
			, document: 'module/document/document'
			, editor: 'module/editor/editor'
			, talk: 'module/talk/talk'

			, bookmarkRead: 'module/reader/bookmarkRead'

			, adminAddDataPopup: 'admin/addPopup'

			/**
			 * 数据
			 * */
			, 'data-tag': '/tag/data'
			, 'data-skin': '/skin'
			, 'data-resume/skill': '/user/resume/skill'
			, 'data-resume/basicData': '/user/resume/basicData'
			, 'data-resume/workHistory': '/user/resume/workHistory'
			, 'data-resume/tags': '/user/resume/tags'
		}
		, baseUrl: '/script/'
		, map: {
			'*': {
				css: '/script/lib/css.js'
				, text: '/script/lib/text.js'
			}
		}
	// }
	// , dataSource: {
	// 	json: 'text!../data/example'
	// 	, tag: 'text!../tag/data'
	// 	, skin: 'text!../skin'
	// 	, resumeSkill: 'text!../user/resume/skill'
	// 	, resumeBasicData: 'text!../user/resume/basicData'
	// 	, resumeWorkHistory: 'text!../user/resume/workHistory'
	// 	, resumeTags: 'text!../user/resume/tags'
	// }
});