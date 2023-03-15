import {useEffect, useState} from 'react';
import maple                 from 'cyan-maple';

import {imgPath} from '../config.js';
import api       from '../api/index.js';

function Img({id}){
	const
		[ img, setImg ] = useState({})
		,
		[ h, setH ] = useState( false )
		;

	useEffect(()=>{
		api.get(`/image/${id}`).then((res)=>{
			setImg( res.data );

			setH( res.data.width / res.data.height > 1.3 );
		});
	}, [id]);

	return (<article className={`module img ${h ? '' : 'img-v'}`}>
		<div className="module_title">&nbsp;</div>
		<div className="img-container">
			<img src={img.src ? imgPath( img.src ) : ''}
			     alt=""/>
		</div>
		<p className="img_desc">{img.desc}</p>
		<div className="img_datetime">{maple.util.dateFormat(new Date( img.createDate ), 'YYYY-MM-DD hh:mm:ss')}</div>
	</article>);
}

export default Img;