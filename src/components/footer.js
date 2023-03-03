function Footer(){
	const menu = [{
		// 	icon: 'picture'
		// 	, link: '#/album?id=7'
		// }, {
			icon: 'valhalla'
			, link: '#/valhalla'
		}]
		;

	return (<footer className="footer">
		<div className="menu flex-container center">
			{menu.map((item)=>{
				return (<div key={item.icon}>
				<a href={item.link}>
					<i className={`icon icon-${item.icon}`}></i>
				</a>
			</div>)
			})}
		</div>
		<div className="copy">
			<a href="http://beian.miit.gov.cn/"
			   target="_blank"
			   rel="noreferrer">辽ICP备2023001481号</a>
		</div>
	</footer>);
}

export default Footer;