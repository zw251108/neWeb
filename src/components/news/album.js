import {imgPath} from '../../config.js';
import maple from 'cyan-maple';

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

	return (<div className={`module news image image-${images[0].imageType} album album-${albumType} album-${Math.min(images.length, 9)}`}>
		<a href={`#/album?newsId=${item.id}`}>
			<div className="news_content">
				{images.slice(0, 9).map(({id, src, desc, type})=>{
					return (<div className={`news_preview container img img-${type}`} key={id}>
						<img src={imgPath( src )}
						     alt={desc}/>
					</div>);
				})}
				<div className="news_detail">
					{images[0].desc && <div className="news_desc">{images[0].desc}</div>}
					{images.length > 9 && <div className="news_more">+{images.length -9}</div>}
				</div>
			</div>
		</a>
	</div>);
}

export default NewsAlbum;