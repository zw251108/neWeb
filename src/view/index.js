import {useState, useEffect} from 'react';

import api from '../api/index.js';

import NewsList from '../components/news/index.js';
import LoadMore from '../components/loadMore/index.js';

function Index(){
	
	const
		[ list, setList ] = useState([])
		,
		[ page, setPage ] = useState(0)
		,
		[ max, setMax ] = useState(false)
		;

	function next(){
		if( max ){
			return ;
		}

		setPage( page +1 );
	}

	useEffect(()=>{
		if( page === 0 ){
			return ;
		}

		api.news({
			page
			, size: 20
		}).then(({data})=>{
			if( !data.length ){
				setMax(true);
			}

			setList((list)=>{
				return list.concat( data );
			});
		});
	}, [page]);

	return (<div className="index container grid">
		<NewsList list={list}></NewsList>
		<LoadMore next={next} max={max}></LoadMore>
	</div>);
}

export default Index;