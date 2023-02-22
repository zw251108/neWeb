import React from 'react';
import ReactDom from 'react-dom';

const Context = React.createContext( null )
	,
	{ Provider
	, Consumer } = Context
	;

class Modal extends React.Component{
	constructor(props){
		super( props );

		this.el = document.createElement('div');
	}

	static contentType = Context;

	componentDidMount(){
		this.context.appendChild( this.el );
	}

	componentWillUnmount(){
		this.context.removeChild( this.el );
	}

	render(){
		return ReactDom.createPortal(this.props.children, this.el);
	}
}

export default Modal;

export {
	Modal
	, Context
	, Provider
	, Consumer
};