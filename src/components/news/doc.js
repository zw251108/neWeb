function NewsDoc({item}){
	let doc = item.content
		;

	return (<article className="module news document">
		<a href={`#/document?id=${item.targetId}`}>
			<h3 className="module_title">{doc.title}</h3>
			<div className="news_desc">
				<h4 className="doc_subTitle">{doc.subTitle}</h4>
				<div className="doc_content">{doc.content}</div>
			</div>
		</a>
	</article>);
}

export default NewsDoc;