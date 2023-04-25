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
		if( this.props.index ){
			return ;
		}
		
		this.context.go('/index');
	}
	goBack(){
		this.context.go(-1);
	}

	render(){
		return (<header className="header">
			<div className="header_content">
				<div>
					<a href="/#/index"
					   onClick={(e)=>{
						   if( this.props.index ){
							   e.preventDefault();
						   }
					   }}>
						<img className="logo"
						     src="/image/logo.png"
						     width="30"
						     height="30"
						     alt=""/>
					</a>
					{!this.props.index && <i className="icon icon-left"
					                         onClick={()=>{this.goBack();}}></i>}
					{this.props.deep && <i className="icon icon-left"
					                       onClick={()=>{this.goBack();}}></i>}
				</div>
				<div>
				    <img className="avatar"
				         src="/image/avatar-96.jpg"
				         width="30"
				         height="30"
				         alt=""/>
					{this.props.filter && <i className="icon icon-filter"></i>}
					{this.props.search && <i className="icon icon-search"></i>}
				</div>
			</div>
		</header>);
	}
}

export default Header;