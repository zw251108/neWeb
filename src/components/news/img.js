import {imgPath} from '../../config.js';

function NewsImg({item}){
	const img = item.content
		,
		{ width
		, height } = img
		, type = width > height ? 'h' : 'v'
		, r = height / width > 1.5
		;
	
	return (<div className={`module news img img-${type} ${type === 'v' && r ? 'img-vh' : ''}`}>
		<a href={`#/${img.more ? `album` : `img`}?id=${item.targetId}`}>
			<div className={`container img img-${type} news_preview`}>
				<img src={imgPath( img.src )}
				     alt={img.desc}/>
				{img.desc && <div className="news_desc">{img.desc}</div>}
				{img.more && <div className="news_more">+{img.more}</div>}
			</div>
		</a>
	</div>);
}

export default NewsImg;