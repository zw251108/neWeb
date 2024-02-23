import {imgPath} from '../../config.js';
import maple from 'cyan-maple';

const MAX_IMG_SHOW = 9
	;

function NewsAlbum({item}){
	const images = item.content.map((img)=>{
			let { width
				, height } = img
				, r = width / height
				, type = width > height ? 'h' : 'v'
				, imageType
				;

			if( type === 'v' ){
				if( r <= 0.5625 ){
					imageType = 'v';
				}
				else if( r <= 0.76 ){
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

			return {
				...img
				, r
				, type
				, imageType
			};
		})
		, albumType = Object.entries( maple.util.classify(images, 'imageType') ).reduce((rs, v)=>{
			if( rs[1].length > v[1].length ){
				return rs;
			}
			else{
				return v;
			}
		})[0]
		;

	return (<div className={`module news image image-${images[0].imageType} album album-${albumType} album-${Math.min(images.length, MAX_IMG_SHOW)}`}>
		<a href={`#/album?newsId=${item.id}`}>
			<div className="news_content">
				{images.slice(0, MAX_IMG_SHOW).map(({id, src, desc, type})=>{
					return (<div className={`news_preview container img img-${type}`} key={id}>
						<img src={imgPath( src )}
						     alt={desc}/>
					</div>);
				})}
				<div className="news_detail">
					{images[0].desc && <div className="news_desc">{images[0].desc}</div>}
					{images.length > MAX_IMG_SHOW && <div className="news_more">+{images.length - MAX_IMG_SHOW}</div>}
				</div>
			</div>
		</a>
	</div>);
}

export default NewsAlbum;