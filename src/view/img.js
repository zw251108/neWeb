import {useState, useEffect} from 'react';

import {imgPath} from '../config.js';
import api       from '../api/index.js';

function Img({id}){
	const
		[ img, setImg ] = useState({
			tags: []
		})
		,
		[ h, setH ] = useState( false )
		;

	useEffect(()=>{
		api.get(`/image/${id}`).then(({data})=>{
			setImg( data );

			setH( data.width / data.height > 1.3 );
		});
	}, [id]);

	return (<article className={`module img ${h ? '' : 'img-v'}`}>
		<div className="module_title">&nbsp;</div>
		<div className="module_content">
			<div className="img_preview">
				<div className="img-container">
					<img src={img.src ? imgPath( img.src ) : ''}
					     alt=""/>
				</div>
			</div>
			<p className="img_desc">{img.desc}</p>
			<div className="flex-container img_info">
				<div className="img_tags">
					{img.tags.map((name)=>{
						return (<span key={name}
						              className="tag">{name}</span>);
					})}
				</div>
				<div className="img_datetime">{img.createDate}</div>
			</div>
		</div>
	</article>);
}

export default Img;