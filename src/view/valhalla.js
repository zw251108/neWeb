import {useEffect, useState} from 'react';

import {imgPath} from '../config.js';
import api       from '../api/index.js';

function Valhalla(){
	const
		[ list, setList ] = useState([])
		,
		[ current, setCurrent] = useState({
			path: []
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
			data.forEach((item)=>{
				if( item.path ){
					item.path = item.path.split(',');
				}
				else{
					item.path = [];
				}
			});
			data.sort((a, b)=>{
				if( !a.weight && !b.weight ){
					return -1;
				}

				return b.weight - a.weight;
			});

			setList( data );
			setCurrent( data[0] );
			setCurrentPic( data[0].path[0] );
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
		setCurrentPic( temp.path[0] );
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
		setCurrentPic( temp.path[0] );
		setCurrentPicIndex(0);
	}

	function set(index){
		setCurrentPic( current.path[index] );
		setCurrentPicIndex( index );
	}

	return (<section className="module valhalla">
		<div className="module_title">{list.length ? current.name : ''}</div>
		{list.length && (<div className="slider">
			<div className="main_view img-container flex-container center justify">
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
			{current.path.length ?
				<div className="preview flex-container left scroll-container">
					{current.path.map((item, index)=>{
						return (<div className={`img-container ${index === currentPicIndex ? 'current' : ''}`}
						             onClick={()=>{
							             set( index );
						             }}
						             key={item}>
							<img src={imgPath( item )}
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
	</section>)
}

export default Valhalla;