function NewsShare({item}){
	let share = item.content
		, createDate = item.createDate
		;

	return (<article className="module news share">
		<a href={share.url}
		   target="_blank">
			<h3 className="module_title">分享文章</h3>
			<div className="news_content">
				<div className="news_detail">
					<div className="news_desc">
						<i className="icon icon-link"></i>
						{share.title}
					</div>
					<div className="news_more">
						{new Array( share.score ).fill(0).map((item, index)=>{
							return (<i className="icon icon-star-full" key={index}></i>);
						})}
					</div>
				</div>
				<div className="news_info">
					<div className="news_tags">
						{share.tags.map((name)=>{
							return (<span key={name}
							              className="tag">{name}</span>);
						})}
					</div>
					<div className="news_datetime">{createDate}</div>
				</div>
			</div>
		</a>
	</article>);
}

export default NewsShare;