import NewsBlog   from './blog.js';
import NewsDoc    from './doc.js';
import NewsImg    from './img.js';
import NewsTips   from './tips.js';
import NewsWeibo  from './weibo.js';
import NewsWeixin from './weixin.js';

function NewsList({list}){
	let blogIndex = 0
		;

	return (<>
		{list.map((item)=>{
			switch( item.type ){
				case 'blog':
					blogIndex++;

					return <NewsBlog item={item} v={blogIndex %3 === 0} key={item.id}></NewsBlog>;
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
	</>);
}

export default NewsList;