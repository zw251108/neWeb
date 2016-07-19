$(function(){

	$('#bookmark').on('click', function(){

		chrome.tabs.getSelected(function(tab){

			$.ajax({
				url: 'http://localhost:9001/data/reader/bookmark/add'
				, type: 'GET'
				, data: {
					url: tab.url
					, email: 'zw150026@163.com'
					, password: 'zw251108'
					, callback: 'a'
				}
				, success: function(json){
					json = JSON.param( json.slice(2, -1) );

					if( json.msg === 'Done' ){

					}
				}
			});
		});
	});
});