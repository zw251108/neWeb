import {useEffect, useState} from 'react';

import api from '../api/index.js';

function Img({id}){
	const
		[ img, setImg ] = useState({})
		;

	useEffect(()=>{
		api.get(`/image/${id}`).then((res)=>{
			setImg( res.data );
		});
	}, []);

	return (<article className="module img">
		<div className="img-container">
			<img src={img.src}
			     alt=""/>
		</div>
		<p className="img_desc">{img.desc}</p>
	</article>);
}

export default Img;