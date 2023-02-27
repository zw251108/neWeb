import {useState, useEffect} from 'react';

import api from '../api/index.js';

function Album({id}){
	const
		[ album, setAlbum ] = useState({
			image: []
		})
		;

	useEffect(()=>{
		api.get(`/album/${id}`).then((res)=>{
			setAlbum( res.data );
		});
	}, []);

	return (<section className="module album">
		<h3 className="module_title"
		    style={{gridRow: 'span 1'}}>相册 {album.name}</h3>
		<div className="grid-container">
			{album.image.map((img)=>{
				let { width, height } = img
					, type = width > height ? 'hor' : 'vor'
					, span = Math.floor( type === 'hor' ? height/width *8 : height/width *4 )
					;

				return (<div className="grid-half"
				             style={{gridRow: `span ${span}`}}
				             key={img.id}>
				<a href={`#/img?id=${img.id}`}>
					<img src={img.src}
					     alt=""/>
				</a>
			</div>);
			})}
		</div>
	</section>);
}

export default Album;