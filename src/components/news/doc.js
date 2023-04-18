function NewsDoc({item}){
	let doc = item.content
		;

	return (<article className="module news document">
		<a href={`#/document?id=${item.targetId}`}>
			<h3 className="module_title">{doc.title}</h3>
			<div className="news_desc">
				{doc.contents.map(({title, content}, index)=>{
					return (<div key={index}>
						<div className="doc_subTitle">{title}</div>
						<div className="doc_content">{content}</div>
					</div>);
				})}
			</div>
		</a>
	</article>);
}

export default NewsDoc;