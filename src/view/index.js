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
		, idCard = {
			content: {
				nickname: ['十方文', '十甫寸', 'Weber']
				, avatar: '/image/avatar-96.jpg'
				, tags: [
					'Web 前端工程师'
					, 'Unity'
					, '独立游戏开发者'
					, '自娱自乐'
					, '自说自话'
					, '不追热点'
					, '不赶时髦'
					, '游戏宅'
					, '手残党'
					, '又菜又爱玩'
					, 'WOWer'
					, 'PvE 玩家'
					, 'LOLer'
					, '大乱斗'
					, '设定党'
					, '思而不学'
					, '博而不精'
					, '颓废'
					, '懒癌'
					, '拖延症'
					, '二流 • 程序员'
					, '三流 • 段子手'
					, '不吐槽会死星人'
					, '收集狂 • 轻'
					, '强迫症 • 中'
					, '变形金刚'
					, '天蝎座'
					, '铲屎官'
					, '社恐'
				]
			}
			, type: 'idCard'
			, id: 0
		}
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
				let rs = list.concat( data )
					;
				
				if( page === 1 && !search && !filter ){
					rs.splice(1, 0, idCard);
				}
				
				return rs;
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