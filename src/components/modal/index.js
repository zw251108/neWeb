import React from 'react';
import ReactDom from 'react-dom';

import ModalContext from '../../context/modal.js'

class Modal extends React.Component{
	constructor(props){
		super(props);

		this.root = this.context;
		this.el = document.createElement('div');
	}

	static contentType = ModalContext;

	componentDidMount(){
		this.root.appendChild( this.el );
	}

	componentWillUnmount(){
		this.root.removeChild( this.el );
	}

	render(){
		return ReactDom.createPortal(this.props.children, this.el);
	}
}

export default Modal;