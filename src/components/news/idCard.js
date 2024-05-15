import {imgPath} from '../../config.js';

function NewsIdCard({item}){
	let user = item.content
		;

	return (<article className="module news idCard">
		<h3 className="module_title">{user.nickname.join(' / ')}</h3>
		<div className="news_content">
			<div className="news_preview container img img-r">
				<img src={user.avatar}
				     alt={user.nickname.join('/')}/>
			</div>
			{/*<div className="news_detail">*/}
			{/*	<div className="news_desc">*/}
			{/*	</div>*/}
			{/*</div>*/}
			<div className="news_info">
				<div className="news_tags">
					{user.tags.map((name)=>{
						return (<span key={name}
						              className="tag">{name}</span>);
					})}
				</div>
			</div>
		</div>
	</article>);
}

export default NewsIdCard;