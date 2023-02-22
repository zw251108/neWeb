function NewsBlog({item}){
	const blog = item.content
		;

	return (<article className="module news blog grid-full">
		<a href={`#/blog?id=${item.targetId}`}>
			<h3 className="blog_title">{blog.title}</h3>
			<div className="news_desc">{blog.content}</div>
			<div className="news_datetime">{item.createDate}</div>
		</a>
	</article>);
}

export default NewsBlog;