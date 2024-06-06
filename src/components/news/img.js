import {imgPath} from '../../config.js';

function NewsImg({item}){
	const img = item.content
		,
		{ width
		, height } = img
		, r = width / height
		;
	let imageType
		, type = width > height ? 'h' : 'v'
		;

	if( type === 'v' ){
		if( r <= 0.5625 ){
			/**
			 * 9: 16
			 * */
			imageType = 'v';

			/**
			 * 图片过长
			 * */
			if( r <= 0.4 ){
				type = 'h';
			}
		}
		else if( r <= 0.76 ){
			/**
			 * 3: 4
			 * */
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
	 * v   9: 16   0.5625
	 * vh    3: 4    0.75
	 * hv   4: 3    1.33333
	 * hv   2430: 1434     1.6245
	 * h   16: 9   1.77777
	 * */
	
	return (<div className={`module news image image-${imageType}`}>
		<a href={`#/img?id=${item.targetId}`}>
			<div className="news_content">
				<div className={`news_preview container img img-${type}`}>
					<img src={imgPath( img.src )}
					     alt={img.desc}/>
				</div>
				{img.desc && (<div className="news_detail">
					<div className="news_desc">{img.desc}</div>
				</div>)}
			</div>
		</a>
	</div>);
}

export default NewsImg;