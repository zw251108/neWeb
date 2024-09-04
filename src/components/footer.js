function Footer(){
	// const menu = [{
	// 	// 	icon: 'picture'
	// 	// 	, link: '#/album?id=7'
	// 	// }, {
	// 		icon: 'valhalla'
	// 		, link: '#/valhalla'
	// 	}]
	// 	;

	return (<footer className="footer">
		{/*<div className="menu container flex center">*/}
		{/*	{menu.map((item)=>{*/}
		{/*		return (<div key={item.icon}>*/}
		{/*		<a href={item.link}>*/}
		{/*			<i className={`icon icon-${item.icon}`}></i>*/}
		{/*		</a>*/}
		{/*	</div>)*/}
		{/*	})}*/}
		{/*</div>*/}
		<div className="copy">
			<a href="http://beian.miit.gov.cn/"
			   target="_blank"
			   rel="noreferrer">辽ICP备2023001481号</a>
			<a href="https://beian.mps.gov.cn/#/query/webSearch?code=21029602000961"
			   rel="noreferrer"
			   target="_blank">
				<img src="/image/gongan.png" width="36" height="40" alt=""/>
				辽公网安备21029602000961</a>
		</div>
	</footer>);
}

export default Footer;