import {useState, useEffect, useRef, useContext} from 'react';

import {imgPath}     from '../config.js';
import RouterContext from '../context/router.js';

import api           from '../api/index.js';
import wechat        from '../lib/wx.js';
import handleArticle from '../components/handleArticle/index.js';
// import Modal         from '../components/modal/index.js';

function Blog({id}){
	const
		[ blog, setBlog ] = useState({
			tags: []
		})
		, ref = useRef(null)
		,
		[ showPwd, setShowPwd ] = useState(false)
		,
		[ answer, setAnswer ] = useState('')
		, router = useContext( RouterContext )
		;

	function fetchBlog(id, data){
		return api.get(`/blog/${id}`, {
			data
		}).then(({code, msg, data})=>{
			if( code !== 0 ){
				alert( msg || '数据错误' );

				return ;
			}

			if( data.status === 3 && !('content' in data) ){
				setShowPwd( true );
			}
			else{
				setShowPwd( false );
			}

			setBlog( data );
		});
	}

	function submit(e){
		e.preventDefault();

		if( !answer ){
			return ;
		}

		fetchBlog(id, {
			answer
		});
	}

	useEffect(()=>{
		fetchBlog( id )
	}, [id]);

	useEffect(()=>{
		handleArticle( ref );

		blog.title && wechat.sign.then((wx)=>{
			wx && wx.ready(()=>{

				// 分享给朋友
				wx.onMenuShareAppMessage({
					title: blog.title
					, desc: blog.short
					, link: window.location.href
					, imgUrl: imgPath('/image/avatar-96.jpg')
					, success(){
						// 设置成功
					}
				});
				wx.updateAppMessageShareData({
					title: blog.title
					, desc: blog.short
					, link: window.location.href
					, imgUrl: imgPath('/image/avatar-96.jpg')
					, success(){
						// 设置成功
					}
				});

				// 分享到朋友圈
				wx.onMenuShareTimeline({
					title: blog.title
					, link: window.location.href
					, imgUrl: imgPath('/image/avatar-96.jpg')
					, success(){
						// 设置成功
					}
				});
				wx.updateTimelineShareData({
					title: blog.title
					, link: window.location.href
					, imgUrl: imgPath('/image/avatar-96.jpg')
					, success(){
						// 设置成功
					}
				});
			});
		});

		document.title = `${blog.title} - 十方文的个人小站`;

		return ()=>{
			document.title = '十方文的个人小站';
		}
	}, [blog]);

	return (<article className="module blog">
		<h2 className="module_title">{blog.title}</h2>
		<div className="module_content">
			{showPwd ?
				null
				:
				(<div className="blog_short">
					<details>
		                <summary>简介</summary>
						<p>{blog.short}</p>
					</details>
					{blog.cover ?
						(<div className="img container">
							<img src={imgPath( blog.cover )}
							     alt={blog.short}/>
						</div>)
						:
						null}
				</div>)}
			<div className="blog_content"
			     ref={ref}>
				{showPwd ?
					(<form onSubmit={submit}>
						<p>当前内容需要输入密码访问</p>
						{blog.question ? (<p>{blog.question}</p>) : null}
						<div className="container flex flex-v">
							<label className="block"
							       htmlFor="answer">请输入密码</label>
							<input type="password"
							       id="answer"
							       name="answer"
							       className="input block"
							       placeholder="请输入密码以访问内容"
							       value={answer}
							       onChange={(e)=>{
								       setAnswer( e.target.value );
							       }}/>
						</div>
						<div className="container flex left">
							<button className="btn"
							        onClick={()=>{
										router.go(-1);
									}}>取消</button>
							<button type="submit"
							        className="btn primary">确定</button>
						</div>
					</form>)
					:
					null}
				<div dangerouslySetInnerHTML={{__html: blog.content}}></div>
			</div>
		</div>
		<div className="module_info">
			<div className="module_tags">
				{blog.tags.map((name)=>{
					return (<span key={name}
					              className="tag">{name}</span>);
				})}
			</div>
			<div className="module_datetime">{blog.createDate}</div>
		</div>
	</article>);
}

export default Blog;