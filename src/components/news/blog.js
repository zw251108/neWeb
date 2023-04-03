function NewsBlog({item}){
	const blog = item.content
		;

	return (<article className="module news blog grid-full">
		<a href={`#/blog?id=${item.targetId}`}>
			<h3 className="module_title">{blog.title}</h3>
			<div className="news_desc">{blog.content}</div>
			{/*<div className="news_datetime">{item.createDate}</div>*/}
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