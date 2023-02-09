import React from 'react';
// import maple from 'cyan-maple';

import {prefix}   from './config.js';
// import AppContext from './context.js';
import Main   from './components/main.js';
import Header from './components/header.js';
import Footer from './components/footer.js';
import Aside  from './components/aside.js';

import initRouter from './router.js';

class App extends React.Component{
	constructor(props){
		super( props );

		this.state = {
			current: 'index'
			, view: null
		};

		// 初始化路由
		this.router = initRouter( this );
		this.router.init();

		window.app = this;
		window.router = this.router;
	}
	render(){
		return (<div className={prefix('App')}>
		    <Header></Header>
		    <Main>
			    {this.state.view}
		    </Main>
		    <Aside></Aside>
		    <Footer></Footer>
		</div>);
	}
}

export default App;