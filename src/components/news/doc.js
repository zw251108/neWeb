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

let a = {"title": "前端文档",
	subTitle: '为何规范'
	, content: '规范并不是一种限制，而是约定，强调团队的一致性；加强团队之间的合作，提高协作效率，优化项目和流程，形成一种团队文化；产品设计通过规范的方式来达到以用户为中心的目的；以标准化的方式设计界面，使最终设计出来的界面风格一致化；前端开发编码人员相互之间开发更轻松，同时便于服务器端开发人员添加功能及前端后期优化维护；最终是为项目服务的，遵循统一的操作规范，减少和改变责任不明，任务不清和由此产生的信息沟通不畅'}

export default NewsDoc;