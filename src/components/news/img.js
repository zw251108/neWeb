function NewsImg({item}){
	const img = item.content
		,
		{ width
		, height } = img
		, type = width > height ? 'hor' : 'vor'
		, span = Math.floor( type === 'hor' ? height/width *8 : height/width *4 )
		;
	
	return (<div className={`module news img img-${type}`}
	             style={{'gridRow': `span ${span}`}}>
		<a href={`#/${img.more ? `album` : `img`}?id=${item.targetId}`}>
			<div className="img-container">
				<img src={img.src}
				     alt={img.desc}/>
				{img.desc && <div className="news_desc">{img.desc}</div>}
				{img.more && <div className="news_more">+{img.more}</div>}
			</div>
		</a>
	</div>);
}

export default NewsImg;