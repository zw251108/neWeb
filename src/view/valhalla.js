import {useState, useEffect} from 'react';

import {imgPath} from '../config.js';
import api       from '../api/index.js';

function Valhalla(){
	const
		[ list, setList ] = useState([])
		,
		[ current, setCurrent] = useState({
			images: []
		})
		,
		[ currentIndex, setCurrentIndex ] = useState(0)
		,
		[ currentPic, setCurrentPic ] = useState('')
		,
		[ currentPicIndex, setCurrentPicIndex] = useState(0)
		;

	useEffect(()=>{
		api.get('/valhalla').then(({data})=>{
			setList( data );
			setCurrent( data[0] );
			setCurrentPic( data[0].images[0] ? data[0].images[0].src : '' );
		});
	}, []);

	function next(){
		if( currentIndex === list.length -1 ){
			return ;
		}

		let temp = list[currentIndex +1]
			;

		setCurrent( temp );
		setCurrentIndex( currentIndex +1 );
		setCurrentPic( temp.images[0] ? temp.images[0].src : '' );
		setCurrentPicIndex(0);
	}
	function prev(){
		if( currentIndex === 0 ){
			return ;
		}

		let temp = list[currentIndex -1]
			;

		setCurrent( temp );
		setCurrentIndex( currentIndex -1 );
		setCurrentPic( temp.images[0] ? temp.images[0].src : '' );
		setCurrentPicIndex(0);
	}

	function set(index){
		setCurrentPic( current.images[index].src );
		setCurrentPicIndex( index );
	}

	return (<section className="module valhalla">
		<div className="module_title">{list.length ? current.name : ''}</div>
		<div className="module_content">
			<div className="valhalla_preview">
				{list.length && (<div className="slider">
					<div className="main-preview img-container flex-container center justify">
						{currentPic ?
							<img src={imgPath( currentPic )}
							     title={current.name}
							     alt="照片待补"/>
							:
							<div className="flex-container center justify">照片待补</div>}
						{currentIndex !== 0 ?
							<div className="prev flex-container left justify"
							     onClick={prev}>
								<i className="icon icon-left"></i>
							</div>
							:
							null}
						{currentIndex !== list.length -1 ?
							<div className="next flex-container right justify"
							     onClick={next}>
								<i className="icon icon-right"></i>
							</div>
							:
							null}
					</div>
					{current.images.length ?
						<div className="preview-list flex-container left scroll-container">
							{current.images.map((item, index)=>{
								return (<div className={`img-container ${index === currentPicIndex ? 'current' : ''}`}
								             onClick={()=>{
									             set( index );
								             }}
								             key={item.src}>
									<img src={imgPath( item.src )}
									     alt=""/>
								</div>);
							})}
						</div>
						:
						null}
					<div className="description">
					     <div className="flex-container left">
							<div>姓&emsp;&emsp;名：</div>
							<div>{current.name}</div>
						</div>
						<div className="flex-container left">
							<div>入职时间：</div>
							<div>{current.start}</div>
						</div>
						<div className="flex-container left">
							<div>离职时间：</div>
							<div>{current.end}</div>
						</div>
						<div className="flex-container left">
							<div>职业生涯：</div>
							<div>{current.description}</div>
						</div>
					</div>
				</div>)}
			</div>
		</div>
	</section>)
}

export default Valhalla;