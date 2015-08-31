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

	$header.find('.toolbar').prepend('<li><a href="/login/"></a></li>')
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
		width: ''
		, height: ''
		, a: ''
	};

	return function(options){
		var opts = $.extend({}, options, defaults)
			, h = opts.height
			, w = opts.width
			, radius = Math.min(w/2, h/2)

			, chart = d3.select(opts.selector).append('svg')
				.attr('class', opts.className)
				.attr('height', h)
				.attr('width', w)
			;

		chart
	};
});

//---------- 应用模块 ----------
require(['module/config'], function(config){
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

	require(['jquery', 'd3', 'radarChart'], function($, d3, draw){
		var chartContainer = d3.select('#profile')
				.select('.module_content')
			;

		var d = [
			[
				{value: 9, axis: 'HTML(5) & CSS(3)'},
				{value: 8, axis: 'JavaScript'},
				{value: 7, axis: 'Node.js'},
				{value: 7, axis: '前端工具'},
				{value: 2, axis: '设计能力'},
				{value: 7, axis: '用户体验'}
			]
		], data = [
			[{
				value: 9, axis: '学习能力'}, {
				value: 7, axis: '创意'}, {
				value: 9, axis: '团队协作'}, {
				value: 8, axis: '应变能力'}, {
				value: 8, axis: '责任心'}, {
				value: 8, axis: '耐心'
			}]
		], data1 = [
			[{
				axis: '思维'
				, desc: '设计感觉，理念，思想。<br/>对专业的直觉。<br/>例：有人有天生色彩感觉好，或对版式的控制感觉良好。'
			}, {
				axis: '视野'
				, desc: '眼界，认知程度。国内设计环境认知，国际流行认知。<br/>广度：国标、界面、动效、视频、平面、标志、字体等。<br/>深度：对某一项有深入研究，特长点。<br/>例：对动效、视频剪辑有深入了解，有一技之长。'
			}, {
				axis: '沟通'
				, desc: '表达能力，聆听。<br/>对自己观点的表述，懂得倾听。<br/>在面试与讨论是状态的体现。'
			}, {
				axis: '动力'
				, desc: '工作状态，动能。<br/>对渴望得到这份工作所做的努力，面试作业的体现。'
			}, {
				axis: '经验'
				, desc: '过往工作经验，职业背景。<br/>应届生可忽略此项。<br/>如果是跨专业，例如平面转GUI，或者产品转交互，需要重新评估。'
			}, {
				axis: '表达'
				, desc: '纯技法，手上功夫。<br/>高级、资深视觉设计师重要考核项。'
			}]
		];

//Options for the Radar chart, other than default
		var mycfg = {
			w: w,
			h: h,
			maxValue: 10,
			levels: 2,
			ExtraWidthX: 300
		};

//	var RadarChart = {
//		draw: function(id, d, options){
		var cfg = {
			padding: '',
			radius: 5,
			w: 270,
			h: 270,
//				factor: 1,
			factorLegend: 0.4,
			levels: 2,
			maxValue: 10,
			radians: 2 * Math.PI,
			opacityArea: 0.5,
			ToRight: 5,
			TranslateX: 0,
			TranslateY: 0,
			ExtraWidthX: 0,
			ExtraWidthY: 0,
			color: d3.scale.category10()
		};

//			cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){
//				return d3.max(i.map(function(o){
//					return o.value;
//				}))
//			}));

		var allAxis = (d[0].map(function(i, j){
			return i.axis
		}));
		var total = allAxis.length;
		var radius = Math.min(cfg.w/2, cfg.h/2);
//			var Format = d3.format('%');
//			d3.select(id).select("svg").remove();
//			d3.select('#profile').find('.module_content')
		var g = d3.select('#profile').select('.module_content')
				.append('div').attr('class', 'radarChart')
				.style('height', '270px')
				.append("svg").style('background', '#fff')
				.attr("width", cfg.w+cfg.ExtraWidthX)
				.attr("height", cfg.h+cfg.ExtraWidthY)
				.append("g")
				.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")
			;

		var tooltip;

		//Circular segments
		for(var j=0; j<cfg.levels; j++){
			var levelFactor = radius*((j+1)/cfg.levels);

			g.selectAll(".levels")
				.data(allAxis)
				.enter()
				.append("svg:line")
				.attr("x1", function(d, i){
					return levelFactor*(1-Math.sin(i*cfg.radians/total));
				})
				.attr("y1", function(d, i){
					return levelFactor*(1-Math.cos(i*cfg.radians/total));
				})
				.attr("x2", function(d, i){
					return levelFactor*(1-Math.sin((i+1)*cfg.radians/total));
				})
				.attr("y2", function(d, i){
					return levelFactor*(1-Math.cos((i+1)*cfg.radians/total));
				})
				.attr("class", "line")
				.attr("stroke", "grey")
				.attr("stroke-opacity", "0.75")
				.attr("stroke-width", 2)
				.attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
		}

		//Text indicating at what % each level is
		for(var j=0; j<cfg.levels; j++){
			var levelFactor = radius*((j+1)/cfg.levels);
			g.selectAll(".levels")
				.data([1]) //dummy data
				.enter()
				.append("svg:text")
				.attr("x", function(d){
					return levelFactor*(1-Math.sin(0));
				})
				.attr("y", function(d){
					return levelFactor*(1-Math.cos(0));
				})
				.attr("class", "legend")
				.style("font-family", "sans-serif")
				.style("font-size", "10px")
				.attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
				.attr("fill", "#737373")
				.text((j+1)*cfg.maxValue/cfg.levels);
		}

		var series = 0;

		var axis = g.selectAll(".axis")
			.data(allAxis)
			.enter()
			.append("g")
			.attr("class", "axis");

		axis.append("line")
			.attr("x1", cfg.w/2)
			.attr("y1", cfg.h/2)
			.attr("x2", function(d, i){return cfg.w/2*(1-Math.sin(i*cfg.radians/total));})
			.attr("y2", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total));})
			.attr("class", "line")
			.style("stroke", "grey")
			.style("stroke-width", "1px");

//			axis.append("text")
//				.attr("class", "legend")
//				.text(function(d){return d})
//				.style("font-family", "sans-serif")
//				.style("font-size", "11px")
//				.attr("text-anchor", "middle")
//				.attr("dy", "1.5em")
//				.attr("transform", function(d, i){return "translate(0, -10)"})
//				.attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
//				.attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

		var dataValues = [];
		d.forEach(function(y, x){

			g.selectAll(".nodes")
				.data(y, function(j, i){
					dataValues.push([
						cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*Math.sin(i*cfg.radians/total)),
						cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*Math.cos(i*cfg.radians/total))
					]);
				});
			dataValues.push(dataValues[0]);
			g.selectAll(".area")
				.data([dataValues])
				.enter()
				.append("polygon")
				.attr("class", "radar-chart-serie"+series)
				.style("stroke-width", "2px")
				.style("stroke", cfg.color(series))
				.attr("points",function(d) {
					var str="";
					for(var pti=0;pti<d.length;pti++){
						str=str+d[pti][0]+","+d[pti][1]+" ";
					}
					return str;
				})
				.style("fill", '#fff')
//				function(j, i){return cfg.color(series)})
				.style("fill-opacity", 0)
//				cfg.opacityArea)
				.on('mouseover', function (d){
//						z = "polygon."+d3.select(this).attr("class");
//						g.selectAll("polygon")
//							.transition(200)
//							.style("fill-opacity", 0.1);
//						g.selectAll(z)
//							.transition(200)
//							.style("fill-opacity", .7);
				})
				.on('mouseout', function(){
//						g.selectAll("polygon")
//							.transition(200)
//							.style("fill-opacity", cfg.opacityArea);
				});
			series++;
		});
		series=0;


		d.forEach(function(y, x){
			g.selectAll("circle")
				.data(y).enter()
				.append("svg:circle")
				.attr("class", "radar-chart-serie"+series)
				.attr('r', cfg.radius)
				.attr("alt", function(j){return Math.max(j.value, 0)})
				.attr("cx", function(j, i){
					dataValues.push([
						cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*Math.sin(i*cfg.radians/total)),
						cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*Math.cos(i*cfg.radians/total))
					]);
					return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*Math.sin(i*cfg.radians/total));
				})
				.attr("cy", function(j, i){
					return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*Math.cos(i*cfg.radians/total));
				})
				.attr("data-id", function(j){return j.axis})
				.style("fill", cfg.color(series)).style("fill-opacity", .9)
				.on('mouseover', function (d){
//						newX =  parseFloat(d3.select(this).attr('cx')) - 10;
//						newY =  parseFloat(d3.select(this).attr('cy')) - 5;
//
//						tooltip
//							.attr('x', newX)
//							.attr('y', newY)
//							.text(
////								Format(
//									d.value
////								)
//							)
//							.transition(200)
//							.style('opacity', 1);
//						d3.select(this).attr('r', '10')
////							.attr('stroke-width', '5px')
////							.attr('stroke', '#efefef');
//
//						z = "polygon."+d3.select(this).attr("class");
//						g.selectAll("polygon")
//							.transition(200)
//							.style("fill-opacity", 0.1);
//						g.selectAll(z)
//							.transition(200)
//							.style("fill-opacity", .7);
				})
				.on('mouseout', function(){
//						d3.select(this).attr('r', '5')
//
//						tooltip
//							.transition(200)
//							.style('opacity', 0);
//						g.selectAll("polygon")
//							.transition(200)
//							.style("fill-opacity", cfg.opacityArea);
				})
				.append("svg:title")
				.text(function(j){return Math.max(j.value, 0)});

			series++;
		});
		//Tooltip
		tooltip = g.append('text')
			.style('opacity', 0)
			.style('font-family', 'sans-serif')
			.style('font-size', '13px');
//		}
//	};


		var chartWidth = 500
			, chartHeight = 500
			, w = 500
			, h = 500
			;

		var colorscale = d3.scale.category10();

//Legend titles
		var LegendOptions = ['Smartphone','Tablet'];

//Data


//Call function to draw the Radar chart
//Will expect that data is in %'s
//	RadarChart.draw("#chart", d, mycfg);

////////////////////////////////////////////
/////////// Initiate legend ////////////////
////////////////////////////////////////////

		var svg = d3.select('#body')
			.selectAll('svg')
			.append('svg')
			.attr("width", w+300)
			.attr("height", h)

//Create the title for the legend
		var text = svg.append("text")
			.attr("class", "title")
			.attr('transform', 'translate(90,0)')
			.attr("x", w - 70)
			.attr("y", 10)
			.attr("font-size", "12px")
			.attr("fill", "#404040")
			.text("What % of owners use a specific service in a week");

//Initiate Legend
		var legend = svg.append("g")
				.attr("class", "legend")
				.attr("height", 100)
				.attr("width", 200)
				.attr('transform', 'translate(90,20)')
			;
		//Create colour squares
		legend.selectAll('rect')
			.data(LegendOptions)
			.enter()
			.append("rect")
			.attr("x", w - 65)
			.attr("y", function(d, i){ return i * 20;})
			.attr("width", 10)
			.attr("height", 10)
			.style("fill", function(d, i){ return colorscale(i);})
		;
		//Create text next to squares
		legend.selectAll('text')
			.data(LegendOptions)
			.enter()
			.append("text")
			.attr("x", w - 52)
			.attr("y", function(d, i){ return i * 20 + 9;})
			.attr("font-size", "11px")
			.attr("fill", "#737373")
			.text(function(d) { return d; })
		;


	});
});