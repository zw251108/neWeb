import React from 'react';

import RouterContext from '../context/router.js';

// function Header(){
// 	return (<header className="header">
// 		<div></div>
// 	</header>);
// }

class Header extends React.Component{
	constructor(props){
		super( props );

		this.a = 1;
	}

	static contextType = RouterContext;

	goIndex(){
		this.context.go('/index');
	}

	render(){
		console.log(this.context)
		return (<header className="header grid-container">
			<div className="header_content grid-full">
				<img className="logo"
				     src="/image/logo.png"
				     width="30"
				     height="30"
				     alt=""/>
				{!this.props.index && <i className="icon icon-left" onClick={()=>{this.goIndex();}}></i>}
				{this.props.deep && <i className="icon icon-left"></i>}
				<img className="avatar"
				     src="/image/avatar-96.jpg"
				     width="30"
				     height="30"
				     alt=""/>
				{this.props.filter && <i className="icon icon-filter"></i>}
				{this.props.search && <i className="icon icon-search"></i>}
			</div>
		</header>);
	}
}

export default Header;