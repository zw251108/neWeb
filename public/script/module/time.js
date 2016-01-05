/**
 * @module  time
 * */
define(['jquery', 'global', 'd3'], function($, g, d3){
	var $time = $('#time')
		, height = 90//$time.height()
		, width = 90//$time.width()

		, $watch = $('#watch')
		, setTime

		, hour
		, minute
		, second
		;

	if( !g.ie ){
		$watch = d3.select('#time').append('svg').attr('class', 'watch').attr('height', height).attr('width', width);
		$watch.append('circle').attr('class', 'watch_wrap').attr('cx', width/2).attr('cy', height/2).attr('r', width/2 - 2);
		$watch.selectAll('rect').data([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).enter().append('rect').attr('class', 'watch_mark')
			.attr('x', width/2 - 1).attr('y', 4).attr('width', '2px').attr('height', '8px').attr('transform', function(d, i){
				return 'rotate('+ 360/12* i +', '+ width/2 +' '+ height/2 +')';
			});
		// hour 指针 高 20 底边 12
		hour = $watch.append('path').attr('class', 'watch_hour').attr('d',
			'M'+ width/2 +','+ (height/2 - 20) +
			'L'+ (width/2 - 6) +','+ height/2 +
			'L'+ (width/2 + 6) +','+ height/2 +
			'L'+ width/2 +','+ (height/2 - 20) );
		// minute 指针 高 30 底边 10
		minute = $watch.append('path').attr('class', 'watch_minute').attr('d',
			'M'+ width/2 +','+ (height/2 - 30) +
			'L'+ (width/2 - 5) +','+ height/2 +
			'L'+ (width/2 + 5) +','+ height/2 +
			'L'+ width/2 +','+ (height/2 - 30) );
		// second 指针 高 40 底边 4
		second = $watch.append('path').attr('class', 'watch_second').attr('d',
			'M'+ width/2 +','+ (height/2 - 40) +
			'L'+ (width/2 - 2) +','+ height/2 +
			'L'+ (width/2 + 2) +','+ height/2 +
			'L'+ width/2 +','+ (height/2 - 40) );

		setTime = function(){
			var time = new Date()
				, h = time.getHours()
				, m = time.getMinutes()
				, s = time.getSeconds()
				;

			h = h > 12 ? h -12 : h;

			hour.transition().duration(1000).attr('transform', 'rotate('+ 360/12 * h +', '+ width/2 +' '+ height/2 +')');
			minute.transition().duration(1000).attr('transform', 'rotate('+ 360/60 * m +', '+ width/2 +' '+ height/2 +')');
			second.transition().duration(1000).attr('transform', 'rotate('+ 360/60 * s +', '+ width/2 +' '+ height/2 +')');
		}

		// todo 改变 metro 模块大小时 watch 的大小跟随变化
	}
	else{
		$watch = $('<div class="watch" id="watch"></div>').appendTo( $time );

		$watch.empty().addClass('watch-info');
		setTime = function(){
			var time = new Date();

			$watch.html( time.toLocaleTimeString() );
		};
	}

	setTime();
	setInterval(setTime, 1000);

	return $time;
});