import React    from 'react';
import {prefix} from '../../config.js';

class Loadmore extends React.Component{
	constructor(props){
		super( props );

		this.ref = React.createRef();
	}

	render(){
		return (<div className={prefix('loadmore')}
		             ref={this.ref}></div>);
	}
}

export default Loadmore;