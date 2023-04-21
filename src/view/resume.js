import {useEffect, useRef} from 'react';
import * as d3             from 'd3';

function Resume(){
	const radarBasicRef = useRef(null)
		, radarSkillRef = useRef(null)
		, coList = [{
			start: '2016.04'
			, end: '2023.02'
			, name: '大连大商天狗电子商务有限公司'
			, work: '制定前端编码规范，优化团队开发流程，为团队成员提供技术上的支持帮助，优化项目代码，更新升级前端技术栈，开发前端通用 UI 框架'
			, summary: '一手还不错的牌，打得烂成这样真是无力吐槽了'
		}, {
			start: '2015.03'
			, end: '2016.02'
			, name: '如是科技（大连）有限公司'
			, work: '制定前端编码规范、文件结构，开发前端通用UI框架'
			, summary: '公司出问题，每个人都是有责任的，但是权利越大，责任越大'
		}, {
			start: '2014.11'
			, end: '2015.03'
			, name: '天向企业'
			, work: '负责项目的 Web 端页面重构 前后端数据交互 交互效果开发'
			, summary: '不重视技术的人，也不会有远见'
		}, {
			start: '2013.04'
			, end: '2014.10'
			, name: '德辉科技（大连）有限公司'
			, work: '负责项目的 Web 端页面重构 前后端数据交互 交互效果开发'
			, summary: 'talk less,do more'
		}, {
			start: '2012.03'
			, end: '2013.03'
			, name: '中科海云网络科技（大连）有限公司'
			, work: '负责项目的前后端数据交互 交互效果开发'
			, summary: '不要盲目扩张，至少要保证资金链'
		}, {
			start: '2009.10'
			, end: '2012.01'
			, name: '大连网景科技有限公司'
			, work: '使用 PHP 语言，负责对 CMS 系统进行二次开发'
			, summary: '创业很艰难，没有目标的创业是不可能的'
		}]
		, eduList = [{
			start: '2005.09'
			, end: '2009.07'
			, name: '大连民族学院'
			, majors: '软件工程'
			, degree: '本科'
		}]
		, skill = [{
			value: 9
			, title: 'HTML(5) & CSS(3)'
		}, {
			value: 8
			, title: 'JavaScript'
		}, {
			value: 7
			, title: '库 & 框架'
		}, {
			value: 7
			, title: 'Node.js & 前端工具'
		}, {
			value: 2
			, title: '设计审美'
		}, {
			value: 6
			, title: '用户体验'
		}]
		, basic = [{
			value: 8
			, title: '团队协作'
		}, {
			value: 9
			, title: '学习能力'
		}, {
			value: 7
			, title: '创意'
		}, {
			value: 6
			, title: '责任心'
		}, {
			value: 5
			, title: '沟通能力'
		}, {
			value: 8
			, title: '视野'
		}]
		, tags = ['Web前端', 'JavaScript', '游戏宅', '拖延症', '社恐', '吐槽']
		;

	function renderRadar(options){
		let opts = Object.assign({}, options, {
				w: 278
				, h: 278
				, padding: 40
			})
			, h = opts.h
			, w = opts.w
			, data = opts.data
			, l = data.length
			, padding = opts.padding
			, r = w /2 - padding
			, startX = r + padding
			, startY = r + padding
			, angle = d3.scaleLinear().domain([0, l]).range([0, 2* Math.PI])
			, val = d3.scaleLinear().domain([0, 10]).range([0, r])
			, a2 = d3.scaleLinear().domain([0, l]).range([0, 360])

			, x = (d, i)=>{
				return startX + Math.sin( angle(i) ) * d.value;
			}
			, y = (d, i)=>{
				return startY - Math.cos( angle(i) ) * d.value;
			}
			, point = d3.line().x( x ).y( y )

			, valPointX = (d, i)=>{
				return startX + Math.sin( angle(i) ) * val( d.value );
			}
			, valPointY = (d, i)=>{
				return startX - Math.cos( angle(i) ) * val( d.value );
			}
			, valPoint = d3.line().x( valPointX ).y( valPointY )

			, chart = d3.select( opts.el ).append('svg').attr('class', 'radar').attr('height', h).attr('width', w)
			, tempData = data.map((d)=>{
				return {
					value: r
					, title: d.title
				};
			})
			;

		// 坐标
		tempData.push( tempData[0] );
		chart.append('path').attr('class', 'radar_hexagon radar_hexagon-big').datum( tempData ).attr('d', point);
		chart.append('path').attr('class', 'radar_hexagon').datum( tempData.map(function(d){
			return {
				value: d.value /2
			};
		}) ).attr('d', point);

		// 坐标文字
		tempData.pop();
		chart.selectAll('text').data( tempData ).enter().append('text').attr('class', 'radar_axis').attr('x', (d, i)=>{
			let ax = x(d, i)
				;

			return (ax - startX) *1.3 + startX;
		}).attr('y', (d, i)=>{
			let ay = y(d, i) - startY
				;

			// 6 为字号大小的一半
			return ( ay > 0 ? ay +6 : ay) *1.1 + startY;
		}).attr('dx', (d)=>{
			let title = d.title
				, l = title.length
				, chinese = /[\u4E00-\u9FA5]/g
				, chineseL = title.match( chinese )
				;

			// 计算汉字的数量
			return '-'+ (l - (l - (chineseL ? chineseL.length : 0)) /2 ) /2 + 'em';
		}).text((d)=>{
			return d.title;
		});

		// 发散线
		chart.selectAll('line').data( tempData ).enter().append('line').attr('class', 'radar_line').attr('x1', startX).attr('y1', startY).attr('x2', x).attr('y2', y);

		// 雷达图
		data.push( data[0] );
		chart.append('path').attr('class', 'radar_path').datum( data ).attr('d', valPoint);

		// 坐标点
		data.pop();
		chart.selectAll('rect').data( data ).enter().append('rect').attr('class', 'radar_point').attr('x', (d, i)=>{
			return valPointX(d, i) - 3;
		}).attr('y', (d, i)=>{
			return valPointY(d, i) - 3;
		}).attr('width', 6).attr('height', 6).attr('transform', (d, i)=>{
			return `rotate(${a2(i) -45}, ${valPointX(d, i)} ${valPointY(d, i)})`;
		});

		// todo 添加交互效果
	}

	useEffect(()=>{
		let radarBasicEl = radarBasicRef.current
			, radarSkillEl = radarSkillRef.current
			;

		renderRadar({
			el: radarBasicEl
			, data: basic
		});
		renderRadar({
			el: radarSkillEl
			, data: skill
		});

		return ()=>{
			radarBasicEl.removeChild( radarBasicEl.firstChild );
			radarSkillEl.removeChild( radarSkillEl.firstChild );
		};
	});

	return (<div className="module resume">
		<h2 className="module_title">周文博的个人简历</h2>
		<section className="module_content resume_section resume_info">
			<h3>基础信息</h3>
			<div>
				<div className="flex-container left">
					<div>姓&emsp;&emsp;名：</div>
					<div>周文博</div>
				</div>
				<div className="flex-container left">
					<div>性&emsp;&emsp;别：</div>
					<div>男 <i className="icon icon-male"></i></div>
				</div>
				<div className="flex-container left">
					<div>婚姻状况：</div>
					<div>未婚</div>
				</div>
				<div className="flex-container left">
					<div>籍&emsp;&emsp;贯：</div>
					<div>黑龙江省哈尔滨市</div>
				</div>
				<div className="flex-container left">
					<div>出生年月：</div>
					<div>1986.11.07</div>
				</div>
				<div className="flex-container left">
					<div>期望城市：</div>
					<div>大连</div>
				</div>
				<div className="flex-container left">
					<div>个人网站：</div>
					<div>
						<a href="//zw150026.com"
						   className="link"
						   target="_blank"
						   rel="noreferrer">http://zw150026.com</a>
					</div>
				</div>
				<div className="flex-container left">
					<div>Github&emsp;：</div>
					<div>
						<a href="https://github.com/zw251108"
						   className="link"
						   target="_blank"
						   rel="noreferrer">https://github.com/zw251108</a>
					</div>
				</div>
				<div className="flex-container left">
					<div>读书列表：</div>
					<div>
						<a href="https://www.douban.com/doulist/3589578"
						   className="link"
						   target="_blank"
						   rel="noreferrer">https://www.douban.com/doulist/3589578</a>
					</div>
				</div>
				<div className="flex-container left">
					<div>个人技能：</div>
					<div>
						<div>熟练使用 Vue 及相关技术栈进行前端开发</div>
						<div>熟悉 React 及相关技术栈</div>
						<div>了解 Angular 技术栈</div>
						<div>熟悉 Sass 等 CSS 预处理语言</div>
						<div>熟悉 Node.js 等服务器端开发</div>
						<div>熟悉 Webpack、Rollup、Gulp、Vite 等前端自动化工具</div>
						<div>熟悉 Git、SVN 等版本控制工具</div>
						<div>了解 PHP、Java 等服务器端开发语言</div>
						<div>熟悉微信公众号和小程序等相关开发</div>
					</div>
				</div>
			</div>
		</section>
		<section className="module_content resume_section resume_radar">
			<h3>个人能力</h3>
			<div className="flex-container round wrap">
				<div className="text-center"
				     ref={radarSkillRef}></div>
				<div className="text-center"
				     ref={radarBasicRef}></div>
			</div>
		</section>
		<section className="module_content resume_section resume_tags">
			<h3>个人标签</h3>
			<div className="flex-container left">
				{tags.map((tag, index)=>{
					return (<span className="tag"
					              key={index}>{tag}</span>)
				})}
			</div>
		</section>
		<section className="module_content resume_section resume_history">
			<h3>工作经历</h3>
			{coList.map((co, index)=>{
				return (<div className=""
			                 key={index}>
					<h4>{co.name}</h4>
					<div>
						<div className="flex-container left">
							<div>入职时间：</div>
							<div>{co.start}</div>
						</div>
						<div className="flex-container left">
							<div>离职时间：</div>
							<div>{co.end}</div>
						</div>
						<div className="flex-container left">
							<div>工作职责：</div>
							<div>{co.work}</div>
						</div>
						<div className="flex-container left">
							<div>吐&emsp;&emsp;槽：</div>
							<div>{co.summary}</div>
						</div>
					</div>
				</div>);
			})}
		</section>
		<section className="module_content resume_section resume_edu">
			<h3>教育经历</h3>
			{eduList.map((edu, index)=>{
				return (<div className=""
				             key={index}>
					<h4>{edu.name}</h4>
					<div>
				        <div className="flex-container left">
							<div>入学时间：</div>
							<div>{edu.start}</div>
						</div>
						<div className="flex-container left">
							<div>毕业时间：</div>
							<div>{edu.end}</div>
						</div>
						<div className="flex-container left">
							<div>专&emsp;&emsp;业：</div>
							<div>{edu.majors}</div>
						</div>
						<div className="flex-container left">
							<div>学&emsp;&emsp;位：</div>
							<div>{edu.degree}</div>
						</div>
					</div>
				</div>);
			})}
		</section>
	</div>);
}

export default Resume;