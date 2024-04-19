import {useState, useEffect, useRef, useContext} from 'react';
import maple                                     from 'cyan-maple';

import RouterContext from '../context/router.js';

const NEWS_TYPE = {
		blog: '博客'
		, img: '图片'
		, album: '相册'
		, words: '碎念'
		, doc: '文档'
		, code: '代码'
		, bookmark: '分享'
	}
	, IMAGE_SIZE = [
		''
		, 'tiny'
		, 'small'
		, 'normal'
		, 'large'
		, 'huge'
	]
	, DEFAULT_IMAGE_SIZE = 3
	;

function Header({index, search: s='', filter: f=''}){
	if( f === '' ){
		f = [];
	}
	else{
		f = f.split(',');
	}

	const router = useContext( RouterContext )
		,
		[ showSearch, setShowSearch ] = useState(false)
		,
		[ keyword, setKeyWord ] = useState( s )
		, searchBarRef = useRef(null)
		,
		[ current, setCurrent ] = useState(false)
		,
		[ filterAll, setFilterAll ] = useState( !!f.length )
		,
		[ filter, setFilter ] = useState( Object.keys( NEWS_TYPE ).reduce((rs, key)=>{
			if( f.length ){
				rs[key] = f.includes( key );
			}
			else{
				rs[key] = true;
			}
			
			return rs;
		}, {}) )
		,
		[ contentAll, setContentAll ] = useState( !f.length )
		,
		[ blogOnly, setBlogOnly ] = useState( f.length === 1 && f[0] === 'blog' )
		,
		[ imageSize, setImageSize ] = useState( DEFAULT_IMAGE_SIZE )
		,
		[ showImageResize, setShowImageResize ] = useState(false)
		, imageResizeRef = useRef(null)
		;

	function closeAll(){
		setShowSearch(false);
		setShowImageResize(false);
	}

	function goBack(){
		router.go(-1);
	}

	function toggleSearchBar(e){
		e.stopPropagation();

		closeAll();

		setShowSearch((r)=>{
			return !r;
		});
	}

	function search(e){
		e.preventDefault();

		let params = {}
			;

		if( keyword ){
			params['search'] = keyword;
		}

		if( !filterAll ){
			params['filter'] = Object.entries( filter ).reduce((rs, [key, value])=>{
				if( value ){
					rs.push( key );
				}

				return rs;
			}, []).join()
		}
		
		setCurrent( !!keyword );

		setContentAll( filterAll );

		setBlogOnly( Object.entries(filter).every(([key, value])=>{
			if( key === 'blog' ){
				return value;
			}
			else{
				return !value;
			}
		}) );
		
		router.go('/index', params);
	}

	function changeFilter(type, checked){
		if( type === 'all' ){
			setFilter((value)=>{
				return Object.keys( value ).reduce((rs, k)=>{
					rs[k] = checked;

					return rs;
				}, {});
			});
		}
		else if( type in filter ){
			setFilter({
				...filter
				, [type]: checked
			});
		}
	}

	useEffect(()=>{
		if( !index ){
			setShowSearch( index );
			setShowImageResize( index );

			setImageSize( DEFAULT_IMAGE_SIZE );
			changeFilter('all', true);
		}
	}, [index])

	useEffect(()=>{
		setFilterAll( Object.entries(filter).every(([key, value])=>{
			return value;
		}) );
	}, [filter]);

	useEffect(()=>{
		let el = searchBarRef.current
			, handler = (e)=>{
				if( !el.contains(e.target) ){
					setShowSearch(false);
				}
			}
			;

		if( el ){
			maple.listener.on(document, 'click', handler);
		}

		return ()=>{
			maple.listener.off(document, 'click', handler);
		};
	}, [showSearch]);

	function toggleImageResize(e){
		e.stopPropagation();

		closeAll();

		setShowImageResize((v)=>{
			return !v;
		});
	}

	useEffect(()=>{
		let el = imageResizeRef.current
			, handler = (e)=>{
				if( !el.contains(e.target) ){
					setShowImageResize(false);
				}
			}
			;

		if( el ){
			maple.listener.on(document, 'click', handler);
		}

		return ()=>{
			maple.listener.off(document, 'click', handler);
		};
	}, [showImageResize]);

	function imageResize(e){
		setImageSize( +e.target.value );
	}

	return (<header className={`header ${IMAGE_SIZE[imageSize] ? `image-${IMAGE_SIZE[imageSize]}` : ''} ${blogOnly ? 'blog-only' : ''} ${contentAll ? 'content-all' : ''}`}>
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
				{index && (<i className={`icon icon-image-resize ${showImageResize ? 'active' : ''}`}
				              onClick={toggleImageResize}></i>)}
				{index && (<i className={`icon icon-search ${showSearch ? 'active' : ''} ${current ? 'current' : ''}`}
				              onClick={toggleSearchBar}></i>)}
				<img className="avatar"
				     src="/image/avatar-30.jpg"
				     width="30"
				     height="30"
				     alt=""/>
			</div>
		</div>
		{showSearch ?
			(<div className="header_searchBar"
			      ref={searchBarRef}>
				<form action="" onSubmit={search}>
					<div className="keywordBar">
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
					<div className="filterList">
						<label className="checkbox">
							<input type="checkbox"
							       checked={filterAll}
							       onChange={(e)=>{
									   changeFilter('all', e.target.checked);
							       }}/>
							<span className="icon icon-checkbox">全部</span>
						</label>
						{Object.entries( NEWS_TYPE ).map(([key, value])=>{
							return (<label className="checkbox" key={key}>
								<input type="checkbox"
								       checked={filter[key]}
								       onChange={(e)=>{
										   changeFilter(key, e.target.checked);
								       }}/>
								<span className="icon icon-checkbox">
									{value}
									{/*<i className={`icon icon-${NEWS_ICON[key]}`}></i>*/}
								</span>
							</label>);
						})}
					</div>
				</form>
			</div>)
			:
			null}
		{showImageResize ?
			(<div className="header_searchBar"
			      ref={imageResizeRef}>
				<div>
					<label htmlFor="imageResize">调整相册图片现实大小</label>
					<input type="range" min="1" max={IMAGE_SIZE.length -1}
					       id="imageResize"
					       value={imageSize}
					       onChange={imageResize}/>
					<span>{IMAGE_SIZE[imageSize] || 'normal'}</span>
				</div>
			</div>)
			:
			null}
	</header>);
}

export default Header;