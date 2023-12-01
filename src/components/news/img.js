import {imgPath} from '../../config.js';

function NewsImg({item}){
	const img = item.content
		,
		{ width
		, height } = img
		, type = width > height ? 'h' : 'v'
		, r = height / width > 1.5
		;
	
	return (<div className={`module news image image-${type} ${type === 'v' && r ? 'image-vh' : ''}`}>
		<a href={`#/${img.more ? `album` : `img`}?id=${item.targetId}`}>
			<div className="news_content">
				<div className={`news_preview container img img-${type}`}>
					<img src={imgPath( img.src )}
					     alt={img.desc}/>
				</div>
				<div className="news_detail">
					{img.desc && <div className="news_desc">{img.desc}</div>}
					{img.more && <div className="news_more">+{img.more}</div>}
				</div>
			</div>
		</a>
	</div>);
}

export default NewsImg;