import {useState, useEffect, useRef, useContext} from 'react';
import maple                             from 'cyan-maple';

import RouterContext from '../context/router.js';

function Header({index}){
	const router = useContext( RouterContext )
		,
		[ showSearch, setShowSearch ] = useState(false)
		,
		[ keyword, setKeyWord ] = useState('')
		, searchBarRef = useRef(null)
		;

	function goBack(){
		router.go(-1);
	}

	function toggleSearchBar(e){
		e.stopPropagation();

		setShowSearch((r)=>{
			return !r;
		});
	}

	function search(e){
		e.preventDefault();
		
		router.go('/index', {
			search: keyword
		});
	}

	useEffect(()=>{
		if( !index ){
			setShowSearch( index );
		}
	}, [index])

	useEffect(()=>{
		let el = searchBarRef.current
			;

		if( el ){
			maple.listener.on(el, 'click', (e)=>{
				e.stopPropagation();
			});
			maple.listener.on(document, 'click', (e)=>{
				setShowSearch(false);
			});
		}

		return ()=>{
			maple.listener.off(document, 'click');
		};
	}, [showSearch]);

	return (<header className="header">
		<div className="header_content">
			<div className="container flex left">
				<a href="/#/index"
				   onClick={(e)=>{
					   if( index ){
						   e.preventDefault();
					   }
				   }}>
					<img className="logo"
					     src="/image/logo.png"
					     width="30"
					     height="30"
					     alt=""/>
				</a>
				{!index && <i className="icon icon-left"
				             onClick={goBack}></i>}
			</div>
			<div className="container flex right">
				{index && (<i className={`icon icon-search ${showSearch ? 'active' : ''} ${keyword ? 'current' : ''}`}
				              onClick={toggleSearchBar}></i>)}
				<img className="avatar"
				     src="/image/avatar-96.jpg"
				     width="30"
				     height="30"
				     alt=""/>
			</div>
		</div>
		{showSearch ?
			(<div className="header_searchBar"
			      ref={searchBarRef}>
				<form action="" onSubmit={search}>
					<div className="container flex">
						<input className="input"
						       type="text"
						       placeholder="请输入搜索内容"
						       value={keyword}
						       onChange={(e)=>{
							       setKeyWord(e.target.value);
						       }}/>
						<button className="btn icon icon-search"
						        type="submit">搜索</button>
					</div>
				</form>
			</div>)
			:
			null}
	</header>);
}

export default Header;