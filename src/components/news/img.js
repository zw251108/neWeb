import {imgPath} from '../../config.js';

function NewsImg({item}){
	const img = item.content
		,
		{ width
		, height } = img
		, type = width > height ? 'h' : 'v'
		;
	
	return (<div className={`module news img img-${type}`}>
		<a href={`#/${img.more ? `album` : `img`}?id=${item.targetId}`}>
			<div className={`img-container img-container-${type} flex-container center justify`}>
				<img src={imgPath( img.src )}
				     alt={img.desc}/>
				{img.desc && <div className="news_desc">{img.desc}</div>}
				{img.more && <div className="news_more">+{img.more}</div>}
			</div>
		</a>
	</div>);
}

export default NewsImg;