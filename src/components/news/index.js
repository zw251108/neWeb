import NewsBlog      from './blog.js';
import NewsDoc       from './doc.js';
import NewsAlbum     from './album.js';
import NewsImg       from './img.js';
import NewsCode      from './code.js';
import NewsWords     from './words.js';
import NewsTips      from './tips.js';
import NewsShare     from './share.js';
import NewsWeibo     from './weibo.js';
import NewsWeiboUser from './weiboUser.js';
import NewsWeixin    from './weixin.js';
import NewsIdCard    from './idCard.js';

function NewsList({list}){
	const itemList = {
			blog: NewsBlog
			, doc: NewsDoc
			, album: NewsAlbum
			, img: NewsImg
			, code: NewsCode
			, words: NewsWords
			, tips: NewsTips
			, bookmark: NewsShare
			, weibo: NewsWeibo
			, weiboUser: NewsWeiboUser
			, weixin: NewsWeixin
			, idCard: NewsIdCard
		}

	return (<>
		{list.map((item)=>{
			let NewsItem = itemList[item.type]
				;

			if( NewsItem ){
				return (<NewsItem item={item}
				                  key={item.id}></NewsItem>);
			}
			else{
				return null;
			}
		})}
	</>);
}

export default NewsList;