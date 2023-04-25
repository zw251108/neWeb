import {useState, useEffect} from 'react';

import {imgPath} from '../config.js';
import api       from '../api/index.js';

function Album({id}){
	const
		[ album, setAlbum ] = useState({
			image: []
		})
		;

	useEffect(()=>{
		api.get(`/album/${id}`).then(({data})=>{
			setAlbum( data );
		});
	}, [id]);

	return (<section className="module album">
		<h2 className="module_title">相册 {album.name}</h2>
		<div className="module_content">
			<div className="container grid percent">
				{album.image.map((img)=>{
					let { width, height } = img
						, type = width > height ? 'h' : 'v'
						;

					return (<div className={`module news image image-${type}`}
					             key={img.id}>
						<a href={`#/img?id=${img.id}`}>
							<div className={`container img img-${type} flex center justify`}>
								<img src={imgPath( img.src )}
								     alt=""/>
							</div>
						</a>
					</div>);
				})}
			</div>
		</div>
	</section>);
}

export default Album;