function NewsBlog({item, v}){
	const
		{ content: blog
		, weight
		, password } = item
		;

	return (<article className="module news blog">
		<a href={`#/blog?id=${item.targetId}`}>
			<h3 className="module_title">{blog.title}</h3>
			{weight || password ? <div className="news_icons">
				{weight ? <i className="icon icon-pin news_pin"></i> : null}
				{password ? <i className="icon icon-lock news_lock"></i> : null}
			</div> : null}
			<div className="news_desc">{password ? '当前内容需要密码访问' : blog.content}</div>
			<div className="flex-container blog_info">
				<div className="blog_tags">
					{blog.tags.map((name)=>{
						return (<span key={name}
						              className="tag">{name}</span>);
					})}
				</div>
				<div className="blog_datetime">{item.createDate}</div>
			</div>
		</a>
	</article>);
}

export default NewsBlog;