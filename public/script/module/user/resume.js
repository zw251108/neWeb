//----- 绘制雷达图 -----
define('radarChart', ['jquery', 'global', 'd3'], function($, g, d3){
	var defaults = {
		w: 278
		, h: 278
		, padding: 40
	};

	return function(options){
		var opts = $.extend({}, options, defaults)
			, h = opts.h
			, w = opts.w
			, data = opts.data
			, l = data.length
			, padding = opts.padding
			, r = w/2 - padding
			, startX = r + padding
			, startY = r + padding
			, angle = d3.scale.linear().domain([0, l]).range([0, 2*Math.PI])
			, val = d3.scale.linear().domain([0, 10]).range([0, r])

			, x = function(d, i){
				return startX + Math.sin( angle(i) ) * d.value;
			}
			, y = function(d, i){
				return startY - Math.cos( angle(i) ) * d.value;
			}
			, point = d3.svg.line().x(x).y(y)

			, valPointX = function(d, i){
				return startX + Math.sin( angle(i) ) * val( d.value );
			}
			, valPointY = function(d, i){
				return startX - Math.cos( angle(i) ) * val( d.value );
			}
			, valPoint = d3.svg.line().x(valPointX).y(valPointY)

			, chart = d3.select(opts.selector).append('svg').attr('class', 'radar').attr('height', h).attr('width', w)
			, tempData = $.map(data, function(d){
				return {
					value: r
					, title: d.title
				}
			})
			;

		// 坐标
		tempData.push( tempData[0] );
		chart.append('path').attr('class', 'radar_hexagon radar_hexagon-big').datum( tempData ).attr('d', point);
		chart.append('path').attr('class', 'radar_hexagon').datum( $.map(tempData, function(d){
			return {
				value: d.value /2
			};
		})).attr('d', point);

		// 坐标文字
		tempData.pop();
		chart.selectAll('text').data( tempData ).enter().append('text').attr('class', 'radar_axis').attr('x', function(d, i){
			var ax = x(d, i)
				;

			return (ax - startX) *1.2 + startX;
		}).attr('y', function(d, i){
			var ay = y(d, i) - startY
				;

			// 6 为字号大小的一半
			return ( ay > 0 ? ay + 6 : ay) *1.1 + startY;
		}).attr('dx', function(d){
			var title = d.title
				, l = title.length
				, chinese = /[\u4E00-\u9FA5]/g
				, chineseL = title.match( chinese )
				;

			// 计算汉字的数量
			return '-'+ (l - (l - (chineseL ? chineseL.length : 0))/2 )/2 + 'em';
		}).text(function(d){
			return d.title;
		});

		// 发散线
		chart.selectAll('line').data( tempData ).enter().append('line').attr('class', 'radar_line').attr('x1', startX).attr('y1', startY).attr('x2', x).attr('y2', y);

		// 雷达图
		data.push( data[0] );
		chart.append('path').attr('class', 'radar_path').datum( data ).attr('d', valPoint);

		// 坐标点
		data.pop();
		chart.selectAll('rect').data( data ).enter().append('rect').attr('class', 'radar_point').attr('x', function(d, i){
			return valPointX(d, i) - 3;
		}).attr('y', function(d, i){
			return valPointY(d, i) - 3;
		}).attr('width', 6).attr('height', 6)
			.attr('transform', function(d, i){
				return 'rotate(45, '+ valPointX(d, i) +' '+ valPointY(d, i) +')';
			});

		// todo 添加交互效果
	};
});

//----- 时间轴 -----
define('timeline', ['jquery', 'global', 'd3'], function($, g, d3){
	var defaults = {

	};

	return function(options){
		var opts = $.extend({}, options, defaults)
			, h = opts.h
			, w = opts.w
			, data = opts.data
			, l = data.length
			, start = opts.start
			, end = opts.end
			, startDate = d3.max(data, function(d){
				return d.start;
			})
			, endDate = d3.max(data, function(d){
				return d.end;
			})
			, time = d3.time.scale().domain([start, end]).range([h -10, 0])
			, $timeline = $('<div class="timeline_content"></div>').appendTo(opts.selector).height(h)
			, $timeNodes
			;

		$timeline.append('<div class="timeline_line"></div>' +
			'<div class="timeline_end">至今</div>' +
			'<div class="timeline_start">'+ start.getFullYear() +'-'+ $.fillZero(start.getMonth() + 1, 2) +'</div>');

		//$timeline.append(
		$.each(data, function(i, d){
			var s = d.start
				, e = (d.end || '')
				, html = ''
				, $node = $('<section class="timeline_node"></section>')
				, top
				, t
				;

			$node.data('start', s);
			$node.data('end', e);

			s = s.split('-');
			e = e.split('-');

			d.start = new Date(s[0], s[1]-1);
			d.end = d.end ? new Date(e[0], e[1]-1) : new Date();


			top = Math.ceil( time( d.end ) -10 );
			$node.css('top', top +'px').height( Math.ceil( time(d.start) - top + 10 ) );

			!$node.data('end') && $node.addClass('timeline_now');

			$node.append('<h4>'+ d.job.title +'<span class="subTitle">'+ d.co.name +'</span></h4>' +
				'<div class="datetime datetime-start">'+ $node.data('start') +'</div>' +
				($node.data('end') ? '<div class="datetime datetime-end">'+ $node.data('end') +'</div>' : '') +
				'<div class="desc">'+ d.job.desc +'</div>');


			//return html +
			//
			//	'</section>';

			$timeline.append( $node );
		});
		//);
	};
});

require(['../../config'], function(config){
	var r = require.config(config.requireConfig)
		, ds = config.dataSource
		;

	r(['jquery', 'global', 'socket'
		, 'radarChart', ds.resumeSkill, ds.resumeBasicData
		, 'timeline', ds.resumeWorkHistory
		, ds.resumeTags
	], function($, g, socket
		, chart, skill, basic
		, timeline, workHistory
		, tags){
		var
		// data1 = [{
		//	title: '思维'
		//	, desc: '设计感觉，理念，思想。<br/>对专业的直觉。<br/>例：有人有天生色彩感觉好，或对版式的控制感觉良好。'
		//}, {
		//	title: '视野'
		//	, desc: '眼界，认知程度。国内设计环境认知，国际流行认知。<br/>广度：国标、界面、动效、视频、平面、标志、字体等。<br/>深度：对某一项有深入研究，特长点。<br/>例：对动效、视频剪辑有深入了解，有一技之长。'
		//}, {
		//	title: '沟通'
		//	, desc: '表达能力，聆听。<br/>对自己观点的表述，懂得倾听。<br/>在面试与讨论是状态的体现。'
		//}, {
		//	title: '动力'
		//	, desc: '工作状态，动能。<br/>对渴望得到这份工作所做的努力，面试作业的体现。'
		//}, {
		//	title: '经验'
		//	, desc: '过往工作经验，职业背景。<br/>应届生可忽略此项。<br/>如果是跨专业，例如平面转GUI，或者产品转交互，需要重新评估。'
		//}, {
		//	title: '表达'
		//	, desc: '纯技法，手上功夫。<br/>高级、资深视觉设计师重要考核项。'
		//}]
		//	,
			$resume = $('#resume')
			, $content = $resume.find('.module_content')
			, $tagsArea = $resume.find('#tagsArea')
			, width = $content.width()
			;

		chart({
			data: $.parseJSON(skill)
			, selector: '#skillRadar'
			, h: Math.max(width/2, 278)
			, w: Math.max(width/2, 278)
		});
		chart({
			data: $.parseJSON(basic)
			, selector: '#baseRadar'
			, h: Math.max(width/2, 278)
			, w: Math.max(width/2, 278)
		});

		timeline({
			data: $.parseJSON(workHistory)
			, selector: '#timeline'
			, start: new Date(2009, 7)
			, end: new Date()
			, h: Math.min(Math.max(278, width), 278*2)
			, w: width
		});

		$tagsArea.html( $.map($.parseJSON(tags), function(d){
			return '<span class="tag">'+ d +'</span>';
		}).join('') );
	});
});