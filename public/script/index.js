/**
 * 首页
 * 全局设置
 * */
//---------- 工具模块 ----------
//----- 地理定位 -----
define('location', function(){});
//----- 本地存储 模块 -----
define('storage', function(){});

//---------- 公用基础模块 ----------
//----- 页头 Header -----
define('header', ['jquery', 'global'], function($, g){
	var $header = $('#header')
		, $pageTitle = $header.find('#pageTitle')
		, $user = $header.find('#user')
		;

	return $header;
});
//----- 用户信息模块 user -----
define('user', ['jquery', 'global', 'socket', 'header'], function($, g, socket, $header){
	// 判断用户数据是否存在

	$header.find('.toolbar').prepend('<li><a href="/login/"></a></li>');
	var $user = $('#user');

	if( !$user.find('img').length ){

	}

	$user.on('click', function(){
		$user.after('<div class="loginBar"><form action=""></form></div>');
	});
});
//----- 绘制雷达图 -----
define('radarChart', ['jquery', 'd3'], function($, d3){
	var defaults = {
		w: 310
		, h: 310
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

			, chart = d3.select(opts.selector).append('svg').attr('class', opts.className).attr('height', h).attr('width', w)
			, tempData = $.map(data, function(d){
				return {
					value: r
					, title: d.title
				}
			})
			;

		// 坐标
		tempData.push( tempData[0] );
		chart.append('path').attr('class', 'hexagon hexagon-big').style('stroke', '#c0c0c0').style('stroke-width', '1px').attr('fill', 'transparent').datum( tempData ).attr('d', point);
		chart.append('path').attr('class', 'hexagon').style('stroke', '#c0c0c0').style('stroke-width', '1px').attr('fill', 'transparent').datum( $.map(tempData, function(d){
				return {
					value: d.value /2
				};
			})).attr('d', point);

		// 坐标文字
		tempData.pop();
		chart.selectAll('text').data( tempData ).enter().append('text').attr('font-size', '12px').attr('x', function(d, i){
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
		chart.selectAll('line').data( tempData ).enter().append('line').style('stroke', '#c0c0c0').style('stroke-dasharray', '5 5').attr('x1', startX).attr('y1', startY).attr('x2', x).attr('y2', y);

		// 雷达图
		data.push( data[0] );
		chart.append('path').attr('class', '').style('stroke', '#888').style('stroke-width', '1px').attr('fill', '#888').style('opacity', 0.5).datum( data ).attr('d', valPoint);

		// 坐标点
		data.pop();
		chart.selectAll('circle').data( data ).enter().append('circle').style('fill', '#fff').style('stroke', '#888').style('stroke-width', '1px').attr('cx', valPointX).attr('cy', valPointY).attr('r', 4);

		// todo 添加交互效果
	};
});

//----- 时间轴 -----
define('timeline', ['jquery', 'd3'], function($, d3){
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
			, time = d3.time.scale().domain([start, end]).range([h, 0])
			, $timeline = $(opts.selector).height(h)
			, $timeNodes
			;

		$timeline.append('<div class="timeline_line"></div>' +
			'<div class="timeline_end">至今</div>' +
			'<div class="timeline_start">'+ start.getFullYear() +'-'+ (start.getMonth()+1) +'</div>');

		//$timeline.append(
		$.map(data, function(d){
			var s = d.start
				, e = (d.end || '')
				, html = '<section class="timeline_node" data-start="'
				, top
				, t
				;

			s = s.split('-');
			e = e.split('-');

			d.start = new Date(s[0], s[1]-1);
			d.end = d.end ? new Date(e[0], e[1]-1) : new Date();
			t = d.start.getMonth() + 1;
			d.startText = d.start.getFullYear() + '-' + (t > 10 ? t : '0' +t);
			t = d.end.getMonth() + 1;
			d.endText = d.end.getFullYear() + '-' + (t > 10 ? t : '0' +t);


			html += s;
			html += '" data-end="';
			html += e;

			html += '" style="top:'+ Math.ceil( time( d.start ) );
			html += 'px;">';

			$('');

			return html +
					'<h4>'+ d.job.title +'</h4>' +
					'<h5>'+ d.co.name +'</h5>' +
					'<div class="datetime"></div>' +
					'<div class="desc">'+ d.job.desc +'</div>' +
				'</section>';
		}).join('')
		//);
	};
});

//---------- 应用模块 ----------
require(['config'], function(config){
	config.requireConfig.baseUrl = 'script/';

	var r = require.config(config.requireConfig);

	r(['jquery', 'global', 'socket', 'time', 'login'], function($, g, socket, $time){
		var $container = g.$container
			, $blog = $('#blog').data('width', 'big') // Blog 模块
			, $document = $('#document').data('width', 'small') // Document 文档模块
			, $editor = $('#editor').data('width', 'normal')   // Editor 编辑器
			, $talk = $('#talk').data('width', 'small') // Talk 模块
			;

		g.mod('$blog', $blog);
		g.mod('$document', $document);
		g.mod('$editor', $editor);
		g.mod('$talk', $talk);
		g.mod('$time', $time);

//	var $login = $('#login')
//		, $loginForm = $login.find('#loginForm')
//		;
//
//	$login.on('submit', '#loginForm', function(e){
//        var loginData = $loginForm.serializeArray()
//            , i = loginData.length
//            , data = {}
//            , temp
//            ;
//
//        while( i-- ){
//            temp = loginData[i];
////            if( temp.name in data ){
////                data[temp.name] += ',' + temp.value;
////            }
////            else
//            data[temp.name] = temp.value;
//        }
//
//        data.receive = 'login';
//
//        socket.on('login', function(data){
//            /**
//             * todo
//             *  登录成功
//             *  保存返回的用户数据
//             * */
//            if( 'error' in data ){
//                console.log('error');
//            }
//            else{
//                console.log('success');
//                g.user = data;
//            }
//
//        });
//
//        socket.emit('login', data);
//
//		e.preventDefault();
//		e.stopImmediatePropagation();
//	});

	});

	r(['jquery', 'd3', 'radarChart', 'timeline'], function($, d3, radar, timeline){

		var skillData = [{
				value: 9, title: 'HTML(5) & CSS(3)'}, {
				value: 8, title: 'JavaScript'}, {
				value: 7, title: '库 & 框架'}, {
				value: 7, title: 'Node.js & 前端工具'}, {
				value: 2, title: '设计审美'}, {
				value: 6, title: '用户体验'
			}]
			, baseData = [{
				value: 8, title: '团队协作'}, {
				value: 9, title: '学习能力'}, {
				value: 7, title: '创意'}, {
				value: 6, title: '责任心'}, {
				value: 5, title: '沟通能力'}, {
				value: 8, title: '视野'
			}]
			//, data1 = [{
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
			, workHistoryData = [{
				start: '2015-03'
				, co: {
					name: '大连面视科技有限公司'
					, href: ''
				}
				, job: {
					title: 'Web 前端工程师'
					, desc: ''
				}
			}, {
				start: '2014-11'
				, end: '2015-03'
				, co: {
					name: '天向企业'
					, href: ''
				}
				, job: {
					title: 'Web 前端工程师'
					, desc: ''
				}
			}, {
				start: '2013-04'
				, end: '2014-09'
				, co: {
					name: '德辉科技（大连）有限公司'
					, href: ''
				}
				, job: {
					title: 'Web 前端工程师'
					, desc: ''
				}
			}, {
				start: '2012-04'
				, end: '2013-04'
				, co: {
					name: '中科海云网络科技（大连）有限公司'
					, href: ''
				}
				, job: {
					title: 'Web 前端工程师'
					, desc: ''
				}
			}, {
				start: '2009-10'
				, end: '2012-03'
				, co: {
					name: '大连网景科技有限公司'
					, href: ''
				}
				, job: {
					title: 'PHP 开发工程师'
					, desc: ''
				}
			}]
			, $profile = $('#profile').detach().appendTo('#container').toggleClass('module-metro module-main tiny large')
			, $content = $profile.find('.module_content')
			, width = $content.width()
			;

		$content.append('<section class="section profile_section" id="score">' +
				'<h3>自我评估</h3>' +
				'<div class="radar" id="skillRadar"></div>' +
				'<div class="radar" id="baseRadar"></div>' +
			'</section>' +
			'<section class="section profile_section">' +
				'<h3>工作经历</h3>' +
				'<div class="timeline" id="timeline"></div>' +
			'</section>');

		radar({
			data: skillData
			, selector: '#skillRadar'
			, h: Math.max(width/2, 310)
			, w: Math.max(width/2, 310)
			, className: ''
		});
		radar({
			data: baseData
			, selector: '#baseRadar'
			, h: Math.max(width/2, 310)
			, w: Math.max(width/2, 310)
			, className: ''
		});

		timeline({
			data: workHistoryData
			, selector: '#timeline'
			, start: new Date(2009, 6)
			, end: new Date()
			, h: width
			, w: width
		});
	});
});