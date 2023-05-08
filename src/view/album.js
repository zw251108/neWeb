import {useState, useEffect} from 'react';

import {imgPath} from '../config.js';
import api       from '../api/index.js';
import LoadMore  from '../components/loadMore/index.js';

function Album({id}){
	const
		[ album, setAlbum ] = useState({})
		,
		[ list, setList ] = useState([])
		,
		[ page, setPage ] = useState(0)
		,
		[ max, setMax ] = useState(false)
		,
		[ fetching, setFetching ] = useState(false)
		;

	function next(){
		if( max ){
			return ;
		}

		if( fetching ){
			return ;
		}

		setPage( page +1 );
	}

	useEffect(()=>{
		api.get(`/album/${id}`).then(({data})=>{
			setAlbum( data );
		});
		setList([]);
		setMax(false);
	}, [id]);

	useEffect(()=>{
		if( page === 0 ){
			return ;
		}

		setFetching(true);

		api.get(`/album/${id}/imgs`, {
			data: {
				albumId: id
				, page
				, size: 20
			}
		}).then(({data})=>{
			if( !data.length ){
				setMax(true);
			}

			setFetching(false);

			setList((list)=>{
				return list.concat( data );
			});
		});
	}, [page]);

	return (<section className="module album">
		<h2 className="module_title">相册 {album.name}</h2>
		<div className="module_content">
			<div className="container grid percent">
				{list.map((img)=>{
					let { width, height } = img
						, type = width > height ? 'h' : 'v'
						;

					return (<div className={`module news image image-${type}`}
					             key={img.id}>
						<a href={`#/img?id=${img.id}&albumId=${id}`}>
							<div className={`container img img-${type} flex center justify`}>
								<img src={imgPath( img.src )}
								     alt=""/>
							</div>
						</a>
					</div>);
				})}
				{!max ?
					(<LoadMore next={next}></LoadMore>)
					:
					null}
			</div>
		</div>
	</section>);
}

export default Album;