/**
 * @module config
 * */
define({
	requireConfig: {
		paths: {
			jquery: 'lib/jquery.min'
			, text: 'lib/text'
			, css: 'lib/css'
			, d3: 'lib/d3.min'

			, template: 'ui/jquery.emmetTpl'
			, layout: 'ui/jquery.layout'
			, pagination: 'ui/jquery.pagination'

			, global: 'module/global'
			//, popup: 'module/popup'
			, socket: 'module/socket'
			, tag: 'module/tag'
			, time: 'module/time'

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
		}
		, baseUrl: '../script/'
	}
	, dataSource: {
		json: 'text!../data/example'
		, tag: 'text!../tag/data'
		, skin: 'text!../skin'
	}
});