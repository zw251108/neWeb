import React from 'react';

import Test from '../components/test/index.js';

import ModalContext from '../context/modal.js';

class Main extends React.Component{
	constructor(props){
		super( props );

		this.modalRef = React.createRef();

		this.a = 1;
	}

	static getDerivedStateFromError(){
		
	}

	componentDidMount(){

	}

	componentDidCatch(error, errorInfo){

	}

	componentWillReceiveProps(nextProps, nextContext){

	}

	componentWillUpdate(nextProps, nextState, nextContext){

	}

	shouldComponentUpdate(nextProps, nextState){
		return true;
	}

	render(){
		return (<div className="main">
			<div>2123</div>
			<Test msg={this.a}>
				<div>123131231</div>
			</Test>
			{router=>{
				return <div>{this.a}</div>;
			}}
			<ModalContext.Provider value={this.modalRef.current}>
				<div>{this.a}</div>
			</ModalContext.Provider>
			<div id="modalRoot" ref={this.modalRef}/>
		</div>);
	}
}

export default Main;