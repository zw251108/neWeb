import {useEffect, useState} from 'react';
import maple                 from 'cyan-maple';

import {prefix} from '../config.js';
import api      from '../api/index.js';

function Img({id}){
	const
		[ img, setImg ] = useState({})
		;

	useEffect(()=>{
		api.get(`/image/${id}`).then((res)=>{
			setImg( res.data );
		});
	}, []);

	return (<section className={prefix('Img')}>
		<article className={prefix('img')}>
			<div className="img-container">
				<img src={img.src}
				     alt=""/>
			</div>
			<p className={prefix('blog_title')}>{img.desc}</p>
		</article>
	</section>);
}

export default Img;