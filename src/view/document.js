import {useState, useEffect, useRef} from 'react';

import handleArticle from '../components/handleArticle/index.js';
import api           from '../api/index.js';

function Content({open, content: {title, content}}){
	const
		[ fold, setFold ] = useState( open )
		,
		[ codeInit, setCodeInit ] = useState(false)
		, el = useRef(null)
		;

	useEffect(()=>{
		if( !fold ){
			return ;
		}
		
		if( codeInit ){
			return ;
		}

		handleArticle( el );

		setCodeInit( true );
	}, [fold, codeInit]);

	return (<section className="doc_content">
		<div className="container flex content_title"
		     onClick={()=>{
				setFold((val)=>{
					return !val;
				});
			 }}>
			<h4>{title}</h4>
			<i className={`icon icon-${fold ? 'up' : 'down'}`}></i>
		</div>
		{fold ?
			(<div className="detail"
	              ref={el}
	              dangerouslySetInnerHTML={{__html: content}}></div>)
			:
			null}
	</section>);
}

function Section({docId, open, section: {id, title, contentOrder}}){
	const
		[ fold, setFold ] = useState( open )
		,
		[ fetched, setFetched ] = useState(false)
		,
		[ content, setContent ] = useState([])
		;

	useEffect(()=>{
		if( !fold ){
			return ;
		}

		if( fetched ){
			return ;
		}

		api.get(`/document/${docId}/${id}`).then(({data})=>{
			setFetched(true);
			setContent( contentOrder.reduce((rs, order)=>{
				let content = data.content.find(({id})=>{
						return id === +order;
					})
					;

				if( content ){
					rs.push( content );
				}

				return rs;
			}, []) );
		});
	}, [fold, docId, id, fetched, contentOrder]);

	return (<section className="module_content doc_section">
		<div className="container flex section_title"
		     onClick={()=>{
				 setFold((val)=>{
					 return !val;
				 });
			 }}>
			<h3>{title}</h3>
			<i className={`icon icon-${fold ? 'up' : 'down'}`}></i>
		</div>
		{fold ?
			(<div className="content_list">
				{content.map((content, index)=>{
					return (<Content key={content.id}
					                 content={content}
					                 docId={docId}
					                 secId={id}
					                 open={index === 0}></Content>);
				})}
			</div>)
			:
			null}
	</section>);
}

function Document({id}){
	const
		[ doc, setDoc ] = useState({
			section: []
		})
		;

	useEffect(()=>{
		api.get(`/document/${id}`).then(({data})=>{
			data.section = data.sectionOrder.reduce((rs, order)=>{
				let section = data.section.find(({id})=>{
						return id === +order;
					})
					;

				if( section ){
					rs.push( section );
				}

				return rs;
			}, []);
			setDoc( data );
		});
	}, [id]);

	return (<article className="module document">
		<h2 className="module_title">{doc.title}</h2>
		{doc.section.map((section, index)=>{
			return (<Section key={section.id}
			                 section={section}
			                 docId={id}
			                 open={index === 0}></Section>);
		})}
	</article>);
}

export default Document;

export {
	Document
	, Section
	, Content
};