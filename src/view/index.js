import {useEffect, useState} from 'react';
import maple                 from 'cyan-maple';

import {prefix} from '../config.js';
import api from '../api/index.js';

import NewsList from '../components/news/index.js';
import Loadmore from '../components/loadmore/index.js';

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
		else if( max ){
			return ;
		}

		api.news({
			page
			, size: 20
		}).then(({data})=>{
			if( !data.length ){
				setMax(true);
			}

			setList( list.concat(data.map((item)=>{
				item.content = JSON.parse( item.content || '{}' );

				item.createDate = maple.util.dateFormat(new Date( item.createDate ), 'YYYY-MM-DD hh:mm:ss');

				return item;
			})) );
		});
	}, [page]);

	return (<div className={`${prefix('Index')} ${prefix('grid-container')}`}>
		<NewsList list={list}></NewsList>
		<Loadmore next={next} max={max}></Loadmore>
	</div>);
}

export default Index;