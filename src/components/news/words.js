function NewsWords({item}){
	const
		{ content: words
		, createDate } = item
		;

	return (<article className="module news words">
		<div className="news_content">
			<div className="news_detail">
				<div className="news_desc">{words.desc}</div>
			</div>
			<div className="news_info">
				<div className="news_datetime">{createDate}</div>
			</div>
		</div>
	</article>);
}

export default NewsWords;