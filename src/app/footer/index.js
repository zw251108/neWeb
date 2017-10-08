'use strict';

import Vue      from 'vue';
import z        from 'z';

import footer   from '../../component/footer/index.vue';

let footerVM = new Vue({
		el: '#footer'
		, render(h){
			return (<footer>

			</footer>);
		}
		, component: {
			footer
		}
	})
	;

export default footerVM;