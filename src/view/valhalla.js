import {useEffect, useState} from 'react';

import {imgPath} from '../config.js';
import api       from '../api/index.js';

function Valhalla(){
	const
		[ list, setList ] = useState([])
		,
		[ current, setCurrent ] = useState(0)
		,
		[ currentPic, setCurrentPic ] = useState(0)
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

			console.log(data)

			setList( data );
		});
	}, []);

	function next(){
		if( current === list.length -1 ){
			return ;
		}

		setCurrent( current +1 );
		setCurrentPic(0);
	}
	function prev(){
		if( current === 0 ){
			return ;
		}

		setCurrent( current -1 );
		setCurrentPic(0);
	}

	function set(index){
		setCurrentPic( index );
	}

	return (<section className="module valhalla">
		<div className="module_title">{list.length ? list[current].name : ''}</div>
		{list.length && (<div className="slider">
			<div className="main_view img-container flex-container center justify">
				{list[current].path[currentPic] ?
					<img src={imgPath(list[current].path[currentPic])}
					     title={list[current].name}
					     alt="照片待补"/>
					:
					<div className="flex-container center justify">照片待补</div>}
				{current !== 0 ?
					<div className="prev flex-container left justify"
					     onClick={prev}>
						<i className="icon icon-left"></i>
					</div>
					:
					null}
				{current !== list.length -1 ?
					<div className="next flex-container right justify"
					     onClick={next}>
						<i className="icon icon-right"></i>
					</div>
					:
					null}
			</div>
			{list[current].path.length ?
				<div className="preview flex-container left scroll-container">
					{list[current].path.map((item, index)=>{
						return (<div className={`img-container ${index === currentPic ? 'current' : ''}`}
						             onClick={()=>{
							             set(index);
						             }}
						             key={item}>
							<img src={imgPath(item)}
							     alt=""/>
						</div>);
					})}
				</div>
				:
				null}
			<div className="description">
			     <div className="flex-container left">
					<div>姓&emsp;&emsp;名：</div>
					<div>{list[current].name}</div>
				</div>
				<div className="flex-container left">
					<div>入职时间：</div>
					<div>{list[current].start}</div>
				</div>
				<div className="flex-container left">
					<div>离职时间：</div>
					<div>{list[current].end}</div>
				</div>
				<div className="flex-container left">
					<div>职业生涯：</div>
					<div>{list[current].description}</div>
				</div>
			</div>
		</div>)}
	</section>)
}

export default Valhalla;