import {useEffect, useContext} from 'react';

import RouterContext from '../context/router.js';

import api from '../api/index.js';
function Weibo({code}){
	let router = useContext( RouterContext )
		, page = 0
		, uid
		, max_id
		;

	useEffect(()=>{
		// api.get('/wb/auth', {
		// 	data: {
		// 		code
		// 		, url: 'http://zw150026.com:3000/#/wb'
		// 	}
		// }).then(({data})=>{
		// 	uid = data.uid;
		// })
	}, [code])

	function fetch(){
		// page++;
		
		api.get('/wb/timeline', {
			data: {
				code
				, max_id
			}
		}).then(({data})=>{
			console.log(data)
			data.statuses.length && (max_id = data.statuses[data.statuses.length -1].id)
		});
	}

	return (<div>{code}
		<button onClick={fetch}>获取</button>
	</div>);
}

export default Weibo;