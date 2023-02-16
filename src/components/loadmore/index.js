import React from 'react';
import maple from 'cyan-maple';

import {prefix} from '../../config.js';

class Loadmore extends React.Component{
	constructor(props){
		super( props );

		this.ref = React.createRef();
	}

	componentDidMount(){
		maple.listener.on(this.ref.current, 'intersectionObserver', ()=>{
			this.props.next();
		});
	}

	componentDidUpdate(){
		if( this.props.max ){
			maple.listener.off(this.ref.current, 'intersectionObserver');
		}
	}

	componentWillUnmount(){
		maple.listener.off(this.ref.current, 'intersectionObserver');
	}

	render(){
		return (<div className={`${prefix('loadmore')} ${this.props.max ? 'hidden' : ''}`}
		             ref={this.ref}>fetch</div>);
	}
}

export default Loadmore;