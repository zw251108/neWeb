import {imgPath} from '../../config.js';

function NewsImg({item}){
	const img = item.content
		,
		{ width
		, height } = img
		, r = width / height
		, type = width > height ? 'h' : 'v'
		;
	let imageType
		;

	if( type === 'v' ){
		if( r <= 0.5625 ){
			imageType = 'v';
		}
		else if( r <= 0.75 ){
			imageType = 'vh';
		}
		else{
			imageType = 'r';
		}
	}
	else{
		if( r <= 1.3333 ){
			imageType = 'r';
		}
		else if( r <= 1.6945 ){
			imageType = 'hv';
		}
		else {
			imageType = 'h';
		}
	}
	/**
	 * vh   9: 16   0.5625
	 * v    3: 4    0.75
	 * hv   4: 3    1.3333
	 * h        1.6245
	 * h   16: 9   1.7777
	 * */
	
	return (<div className={`module news image image-${imageType}`}>
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