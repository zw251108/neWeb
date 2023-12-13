import {useState, useEffect} from 'react';

import api      from '../api/index.js';
import NewsList from '../components/news/index.js';
import LoadMore from '../components/loadMore/index.js';

function Index({search, filter}){
	const
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
		setList([]);
        setMax(false);
		setPage(0);
	}, [search, filter]);

	useEffect(()=>{
		if( page === 0 ){
			return ;
		}

		setFetching(true);

		api.news({
			search
			, filter
			, page
			, size: 20
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

	return (<div className="index container grid">
		<NewsList list={list}></NewsList>
		{!max ?
			(<LoadMore next={next}></LoadMore>)
			:
			null}
	</div>);
}

export default Index;