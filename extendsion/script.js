$(function(){
	$('#bookmark').on('click', function(){

		chrome.tabs.getSelected(function(tab){

			$.ajax({
				url: 'http://localhost:9001/data/reader/bookmark/'
				, type: 'POST'
				, data: {
					url: tab.url
					, email: 'zw150026@163.com'
					, password: 'zw251108'
				}
				, dataType: 'json'
				, success: function(json){

					if( json.msg === 'Done' ){

					}
					else{
						alert( json.msg );
					}
				}
			});
		});
	});
});