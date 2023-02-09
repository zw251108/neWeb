import NewsList from '../components/newsList/index.js';
import Loadmore from '../components/loadmore/index.js';

function Index({list}){
	return (<section>
		<NewsList list={list}></NewsList>
		<Loadmore></Loadmore>
	</section>);
}

export default Index;