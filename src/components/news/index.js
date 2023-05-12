import NewsBlog      from './blog.js';
import NewsDoc       from './doc.js';
import NewsImg       from './img.js';
import NewsCode      from './code.js';
import NewsTips      from './tips.js';
import NewsWeibo     from './weibo.js';
import NewsWeiboUser from './weiboUser.js';
import NewsWeixin    from './weixin.js';

function NewsList({list}){
	const itemList = {
			blog: NewsBlog
			, doc: NewsDoc
			, img: NewsImg
			, code: NewsCode
			, tips: NewsTips
			, weibo: NewsWeibo
			, weiboUser: NewsWeiboUser
			, weixin: NewsWeixin
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