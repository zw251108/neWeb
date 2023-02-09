import {prefix}   from '../../config.js';
import NewsBlog   from './blog.js';
import NewsDoc    from './doc.js';
import NewsImg    from './img.js';
import NewsTips   from './tips.js';
import NewsWeibo  from './weibo.js';
import NewsWeixin from './weixin.js';

function NewsList({list}){
	return (<div className={prefix('newsList')}>
		{list.map((item)=>{
			switch( item.type ){
				case 'blog':
					return <NewsBlog item={item} key={item.id}></NewsBlog>;
				case 'doc':
					return <NewsDoc item={item} key={item.id}></NewsDoc>;
				case 'img':
					return <NewsImg item={item} key={item.id}></NewsImg>;
				case 'tips':
					return <NewsTips item={item} key={item.id}></NewsTips>;
				case 'weibo':
					return <NewsWeibo item={item} key={item.id}></NewsWeibo>;
				case 'weixin':
					return <NewsWeixin item={item} key={item.id}></NewsWeixin>;
				default:
					return null;
			}
		})}
	</div>);
}

export default NewsList;