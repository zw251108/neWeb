/**
 *
 * */
require(['../config'], function(config){
	var r = require(config);
	r(['jquery', 'global', 'socket', 'template'], function($, g, socket){
		var $rss = $('#rss')
			, dlTpl = $.template({
				template: 'dt>a[href=%link%]{%title%}^dd{%content%}'
			})
			;

		$rss.on('click', '.rss_section > a', function(e){
			e.preventDefault();

			var $that = $(this)
				, feed = $that.data('feed')
				, id = $that.data('id')
				;

			socket.emit('getData', {
				topic: 'rss/feedList'
				, query: {
					feed: feed
					, id: id
				}
			})
		}).on('click', 'dt > a', function(e){
			e.preventDefault();

			var $that = $(this);

			socket.emit('getData', {
				topic: 'rss/article'
				, query: {
					url: this.href
				}
			});
		});

		socket.register({
			'rss/feedList': function(data){
				var id;
				if( 'error' in data ){

				}
				else{
					id = data.id;
					data = data.data;

					$rss.find('#rss'+ id).find('dl').html( dlTpl(data).join('') );
				}
			}
			, 'rss/article': function(data){
				console.log(data);
			}
		})
	});
});