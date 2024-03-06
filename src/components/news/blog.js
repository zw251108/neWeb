import {imgPath} from '../../config.js';

function NewsBlog({item}){
	const
		{ content: blog
		, weight
		, password
		, createDate
		, updateDate } = item
		, now = Date.now()
		, isNew = now - new Date( createDate ) < 3*24*60*60*1000
		, isUpdate = now - new Date( updateDate ) < 3*24*60*60*1000
		;

	return (<article className="module news blog">
		<a href={`#/blog?id=${item.targetId}`}>
			<h3 className="module_title">{blog.title}</h3>
			{weight ?
				<i className="icon icon-pin news_pin"></i>
				:
				(isNew ?
					<i className="icon icon-new-char news_new"></i>
					:
					(isUpdate ?
						<i className="icon icon-update news_update"></i>
						:
						null))}
			{password ?
				(<div className="news_content">
					<div className="news_detail">
						<div className="news_lock"><i className="icon icon-lock"></i>当前内容需要密码访问</div>
						<div className="news_more">阅读更多<i className="icon icon-right"></i></div>
					</div>
					<div className="news_info">
						<div className="news_datetime">{createDate}</div>
					</div>
				</div>)
				:
				(<div className="news_content">
					{blog.preview ?
						(<div className="news_preview container img img-h">
							<img src={imgPath(blog.preview)}
							     alt={blog.content}/>
						</div>)
						:
						null}
					<div className="news_detail">
						<div className="news_desc"
						     dangerouslySetInnerHTML={{__html: blog.content}}></div>
						<div className="news_more">阅读更多<i className="icon icon-right"></i></div>
					</div>
					<div className="news_info">
						<div className="news_tags">
							{blog.tags.map((name)=>{
								return (<span key={name}
								              className="tag">{name}</span>);
							})}
						</div>
						<div className="news_datetime">{createDate}</div>
					</div>
				</div>)}
		</a>
	</article>);
}

export default NewsBlog;