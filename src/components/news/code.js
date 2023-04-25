import {imgPath} from '../../config.js';

function NewsCode({item}){
	const code = item.content
		;


	return (<div className="module news editor">
		<a href={`#/editor?id=${item.targetId}`}>
			<h3 className="module_title">{code.title}</h3>
			<div className="container img flex center justify">
				<img src={imgPath( code.src )}
				     alt={code.title}/>
			</div>
			<div className="module_info">
				<div className="module_tags">
					{code.tags.map((name)=>{
						return (<span key={name}
						              className="tag">{name}</span>);
					})}
				</div>
				<div className="module_datetime">{item.createDate}</div>
			</div>
		</a>
	</div>);
}

export default NewsCode;