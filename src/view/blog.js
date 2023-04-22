import {useState, useEffect, useRef} from 'react';

import handleArticle from '../components/handleArticle/index.js';
import api           from '../api/index.js';
// import Modal         from '../components/modal/index.js';

function Blog({id}){
	const
		[ blog, setBlog ] = useState({
			tags: []
		})
		, el = useRef(null)
		,
		[ showPwd, setShowPwd ] = useState(false)
		,
		[ answer, setAnswer ] = useState('')
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
		handleArticle( el );
	}, [blog]);

	return (<article className="module blog">
		<h2 className="module_title">{blog.title}</h2>
		<div className="module_content">
			<div className="blog_content"
			     ref={el}>
				{showPwd ?
					(<form onSubmit={submit}>
						<p>当前内容需要输入密码访问</p>
						{blog.question ? (<p>{blog.question}</p>) : null}
						<div className="flex-container flex-container-v">
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
						<div className="flex-container left">
							<button className="btn"
							        onClick={()=>{

									}}>取消</button>
							<button type="submit"
							        className="btn primary">确定</button>
						</div>
					</form>)
					:
					null}
				<div dangerouslySetInnerHTML={{__html: blog.content}}></div>
			</div>
			<div className="flex-container blog_info">
				<div className="blog_tags">
					{blog.tags.map((name)=>{
						return (<span key={name}
						              className="tag">{name}</span>);
					})}
				</div>
				<div className="blog_datetime">{blog.createDate}</div>
			</div>
		</div>
	</article>);
}

export default Blog;