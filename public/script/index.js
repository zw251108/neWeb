/**
 * 首页
 * 全局设置
 * */
require.config({
	packages: [{
		name: 'plugin/syntaxhighlighter'
		, main: 'XRegExp'
	}]
	, shim: {
		template: ['jquery']
	}
	, paths: {
		'socket.io': '../socket.io/socket.io'
		, jquery: 'lib/jquery/jquery.min'
		, template: 'ui/jquery.template'

		, d3: 'lib/d3/d3.min'

		// 全局模块设置

		// 应用模块设置
		, blog: 'module/blog'
		, document: 'module/document'
		, editor: 'module/editor'
		, talk: 'module/talk'
		, time: 'module/time'
	}
});

//---------- 工具模块 ----------
//----- web socket 模块 目前基于 socket.io -----
define('socket', ['socket.io'], function(io){
	var socket = io('http://localhost:9001');

	socket.on('error', function(err){

		if( err === 'session not found' ){
			/**
			 * session 失效
			 *  todo
			 *  断开连接
			 *  提示用户
			 * */
			socket.disconnect();
			console.log('断开连接')
		}
	});

	return socket;
});
//----- 地理定位 -----
define('location', function(){});
//----- 本地存储 模块 -----
define('storage', function(){});

//---------- 公用基础模块 ----------
//----- 全局模块 -----
define('global', ['jquery', 'socket'], function($, socket){
	// 兼容 console
	if( !('console' in window) || !('log' in console) || (typeof console.log !== 'function') ){
		window.console = {
			logStack:[],
			log:function(value){
				this.logStack.push(value);
			}
		}
	}
	else{
		// 自娱自乐。。。
		console.log(
			'      __    __   __ __ __   __         __         __ __ __\n'  +
			'    /  /  /  / /   __ __/ /  /       /  /       /   __   /\n'  +
			'   /  /__/  / /  /__     /  /       /  /       /  /  /  /\n'   +
			'  /   __   / /   __/    /  /       /  /       /  /  /  /\n'    +
			' /  /  /  / /  /__ __  /  /__ __  /  /__ __  /  /__/  /\n'     +
			'/__/  /__/ /__ __ __/ /__ __ __/ /__ __ __/ /__ __ __/\n'      +
			'\n\n 有什么疑问吗？直接给我留言吧 :)');
	}

	var g =  window.GLOBAL || {}
		, animationEnd = 'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd'
		;

	g.$body = $(document.body);
	g.$overlay = $('#overlay');

	g._MODULE = [];
	g._$MODULE = {};
	g.mod = function(moduleName, moduleValue){
		var type = typeof moduleName
			, rs = false
			;

		if( moduleValue && typeof type === 'string' ){

			g._MODULE.push(moduleName);
			g._$MODULE[moduleName] = moduleValue;

			rs = true;
		}
		else if( type === 'string' ){
			rs = moduleName in g._$MODULE ? g._$MODULE[moduleName] : null;
		}
		else if( type === 'number' ){
			rs = (moduleName >= 0 && moduleName < g._MODULE.length) ? g._$MODULE[g._MODULE[moduleName]] : null;
		}

		return rs;
	};
	g.numMod = function(){
		return g._MODULE.length;
	};

	g.eventType = {
		animationEnd: animationEnd
	};

	window.GLOBAL = g;// 释放到全局

	var $container = $('#container')
		, target
		;
	$container.on({
		'webkitAnimationEnd mozAnimationEnd msAnimationEnd animationEnd': function(){
			var $t = g.mod('$' + target);

			$container.addClass('animate-done');

			if( $container.hasClass('fadeOut') ){   // 淡出

				if( $container.hasClass('main-show') ){ // 显示 main 模块

					// 隐藏 metro 模块
					$container.addClass('hideMetro');

					// 切换 main 模块状态
					$t.removeClass('module-metro ' + $t.data('width')).addClass('module-main large');

					// todo
					if( $container.hasClass('main-data') ){
						$container.triggerHandler('showMain')
					}
				}
				else{   // 显示全部 metro 模块
					$t.removeClass('module-main large').addClass('module-metro ' + $t.data('width')).wrap('<a href="/'+ $t.attr('id') +'/"></a>');

					$container.triggerHandler('showMetro');
				}
			}
			else if( $container.hasClass('fadeIn') ){   // 淡入
				$container.removeClass('fadeIn animate-done');
			}
		}
		, dataReady: function(){
			if( $container.hasClass('animate-done') ){
				$container.triggerHandler('showMain');
			}
			else{
				$container.addClass('main-data');
			}
		}
		, showMain: function(){
			$container.removeClass('animate-done main-data fadeOut').addClass('fadeIn');
		}
		, showMetro: function(){
			$container.removeClass('animate-done fadeOut hideMetro').addClass('fadeIn');
		}
	}).on('click', '.module', function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var $target;

		if( $container.hasClass('fadeOut') || $container.hasClass('fadeIn') ) return;

		target = this.id;
		$target = g.mod('$'+ target);

		if( !$target.hasClass('module-metro') ) return;

		// todo 加入 本地存储

		$target.unwrap();
		$container.addClass('main-show fadeOut');

		if( $target.data('getData') ){  // 已获取基础数据
			// 展开
			$container.triggerHandler('dataReady');
		}
		else{   // 未获取基础数据
			require([target], function(){
				socket.emit('getData', {
					topic: target
					, receive: 'get'+ target.replace(/^(.{1})/, function(s){return s.toUpperCase();}) +'Data'
				});
			});
		}
	}).on('click', '.module-main .module_close', function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		if( $container.hasClass('fadeOut') || $container.hasClass('fadeIn') ) return;

		var $t = $(this).parents('.module');
		target = $t.attr('id');

		$container.removeClass('main-show').addClass('fadeOut');
	});

	g.$container = $container;

	return g;
});
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
//----- 标签数据 Tag -----
define('tag', ['jquery', 'socket', 'template'], function($, socket){
	var Tag = {
		tagTmpl: $.template({
			template: 'span.tag[data-tagid=%Id%]{%name%}'
		})
	};
	socket.emit('getData', {
		topic: 'tag'
		, receive: 'getTagData'
	});

	socket.on('getTagData', function(data){
		Tag.data = data;
	}).on('addTag', function(){
		socket.emit('addTag', {
			name: ''
		});
	});

	return Tag;
});

//---------- 应用模块 ----------
require(['jquery', 'global', 'socket', 'time'], function($, g, socket, $time){

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

define('radarChart', ['jquery', 'd3'], function(d3){
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
require(['jquery', 'd3', 'radarChart'], function($, d3, draw){
	var chartContainer = d3.select('#profile')
			.select('.module_content')
		;

	var d = [
		[
			{axis: 'HTML(5) & CSS(3)', value: 9},
			{axis: 'JavaScript(jQuery)', value: 8},
			{axis: 'Node.js', value: 7},
			{axis: '前端工具', value: 7},
			{axis: '设计能力', value: 2},
			{axis: '用户体验', value: 7}
		]
	], data = [
		[
			{axis: '学习能力',value: 9},
			{axis: '创意',value: 7},
			{axis: '团队协作',value: 9},
			{axis: '应变能力',value: 8},
			{axis: '责任心',value: 8},
			{axis: '耐心',value: 8}
		]
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