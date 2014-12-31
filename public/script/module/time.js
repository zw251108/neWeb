/**
 * @module  time
 * */
define(['jquery', 'global'], function($, g){
	var $time = $('#time')
		, $watch = $('#watch')
		, $hourHand
		, $minuteHand
		, $secondHand
		, setTime
		;

	$time.on({
		init: function(){}

		, watchStop: function(){}
	});

	if( !g.ie ){
		var prefix = '',
			temp = document.createElement('div').style;

		if( '-webkit-transform' in temp ){
			prefix = '-webkit-';
		}
		else if( '-moz-transform' in temp ){
			prefix = '-moz-';
		}
		else if( '-ms-transform' in temp ){
			prefix = '-ms-';
		}
		else if( '-o-transform' in temp ){
			prefix = '-o-';
		}

		$hourHand = $watch.find('#hourHand');
		$minuteHand = $watch.find('#minuteHand');
		$secondHand = $watch.find('#secondHand');
		setTime = function(){
			var time = new Date(),
				d = time.getHours(),
				m = time.getMinutes();
			$hourHand.get(0).style[prefix +'transform'] = 'rotate('+ ((d >11 ? d -12 : d)*30 + Math.floor( m /12 )*6) +'deg)';
			$minuteHand.get(0).style[prefix +'transform'] = 'rotate('+ m *6 +'deg)';
			$secondHand.get(0).style[prefix +'transform'] = 'rotate('+ time.getSeconds()*6 +'deg)';
		};
	}
	else{
		$watch.empty().addClass('watch_wrap-info');
		setTime = function(){
			var time = new Date();

			$watch.html( time.toLocaleTimeString() );
		};
	}

	$watch.removeClass('hidden');
	setTime();
	setInterval(setTime, 1000);

	return $time;
});