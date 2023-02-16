import React from 'react';

import {prefix}      from '../config.js';
import RouterContext from '../context/router.js';

// function Header(){
// 	return (<header className={prefix('header')}>
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
		return (<header className={`${prefix('header')} ${prefix('grid-container')}`}>
			<div className={`${prefix('header_content')} ${prefix('grid-full')}`}>
				<img className={prefix('logo')}
				     src="/image/logo.png"
				     width="30"
				     height="30"
				     alt=""/>
				{!this.props.index && <i className="icon icon-left" onClick={()=>{this.goIndex();}}></i>}
				{this.props.deep && <i className="icon icon-left"></i>}
				<img className={prefix('avatar')}
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