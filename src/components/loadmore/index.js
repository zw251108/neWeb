import React from 'react';
import maple from 'cyan-maple';

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
		return (<div className={`loading grid-full ${this.props.max ? 'hidden' : ''}`}
		             ref={this.ref}>
			<div className="loading-chasing"></div>
		</div>);
	}
}

export default Loadmore;