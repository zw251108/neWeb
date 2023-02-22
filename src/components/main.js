import React from 'react';

// import AppContext                from '../context.js';
import {Context as ModalContext} from './modal/index.js';

class Main extends React.Component{
	constructor(props){
		super( props );

		this.modalRef = React.createRef();

		this.list = props.list;
	}

	static getDerivedStateFromError(){
		
	}

	// static contextType = AppContext;

	componentDidMount(){

	}

	componentDidCatch(error, errorInfo){

	}

	// componentWillReceiveProps(nextProps, nextContext){
	//
	// }
	//
	// componentWillUpdate(nextProps, nextState, nextContext){
	//
	// }

	shouldComponentUpdate(nextProps, nextState){
		return true;
	}

	render(){
		return (<main className="main">
			<ModalContext.Provider value={this.modalRef.current}>
				{this.props.children}
			</ModalContext.Provider>
			<div id="modalRoot" ref={this.modalRef}/>
		</main>);
	}
}

export default Main;