import React, {useState, useEffect, useRef} from 'react';

import {basicSetup}     from 'codemirror';
import {EditorState}    from '@codemirror/state';
import {EditorView}     from '@codemirror/view';
import {javascript}     from '@codemirror/lang-javascript';
import {html}           from '@codemirror/lang-html';
import {css}            from '@codemirror/lang-css';
import {StreamLanguage} from '@codemirror/language';
import {shell}          from '@codemirror/legacy-modes/mode/shell';
import {sql}            from '@codemirror/legacy-modes/mode/sql';
import {oneDark}        from '@codemirror/theme-one-dark';

import api from '../api/index.js';

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

		let temp = el.current.querySelectorAll('textarea[data-code-type]')
			;

		temp.forEach((el)=>{
			let codeType = el.dataset.codeType
				, view
				, config = {
					doc: el.value
					, extensions: [
						basicSetup
						, EditorState.readOnly.of(true)
						, oneDark
					]
				}
				;

			switch( codeType ){
				case 'js':
					config.extensions.push( javascript() );

					break;
				case 'css':
					config.extensions.push( css() );

					break;
				case 'html':
					config.extensions.push( html() );

					break;
				case 'shell':
					config.extensions.push( StreamLanguage.define(shell) );

					break;
				case 'sql':
					config.extensions.push( StreamLanguage.define(sql({})) );

					break;
				default:
					config = null;

					break;
			}

			if( config ){
				view = new EditorView({
					state: EditorState.create( config )
				});
				el.parentNode.insertBefore(view.dom, el);
				el.style.display = 'none';
			}
		});

		setCodeInit( true );
	}, [fold]);

	return (<section className="doc_content">
		<div className="flex-container content_title"
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

function Section({docId, open, section: {id, title}}){
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
			setContent( data.content );
		});
	}, [fold]);

	return (<section className="module_content doc_section">
		<div className="flex-container section_title"
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