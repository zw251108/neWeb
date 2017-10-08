'use strict';

import Vue      from 'vue';
import z        from 'z';

import header   from '../../component/header/index.vue';

let headerVM = new Vue({
		el: '#header'
		, render(h){
			return (<header>

			</header>);
		}
		, component: {
			header
		}
	})
	;

export default headerVM;