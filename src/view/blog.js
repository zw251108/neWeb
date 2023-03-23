import React from 'react';
import maple from 'cyan-maple';

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

import {imgPath} from '../config.js';
import api       from '../api/index.js';

class Blog extends React.Component{
	constructor(props){
		super( props );

		this.el = null;
		this.state = {
			id: props.id
			, title: ''
			, content: ''
		};
	}

	componentDidMount(){
		this.fetch( this.props.id );
	}

	shouldComponentUpdate(nextProps, nextState, nextContext){
		if( nextProps.id !== this.props.id ){
			this.fetch( nextProps.id );

			return false;
		}

		return true;
	}

	componentDidUpdate(){
		let temp = this.el.querySelectorAll('textarea[data-code-type]')
			, imgs = this.el.querySelectorAll('img')
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

		imgs.forEach((el)=>{
			let url = maple.url.parseUrl( el.src )
				;

			el.src = imgPath( url.path );
		});
	}

	fetch(id){
		api.get(`/blog/${id}`).then((res)=>{
			this.setState( res.data );
		});
	}

	render(){
		return (<article className="module blog">
			<h2 className="module_title">{this.state.title}</h2>
			<div className="module_content">
				<div className="blog_content"
				     ref={(el)=>{
					     this.el = el;
				     }}
				     dangerouslySetInnerHTML={{__html: this.state.content}}></div>
				<div className="blog_datetime">{maple.util.dateFormat(new Date( this.state.createDate ), 'YYYY-MM-DD hh:mm:ss')}</div>
			</div>
		</article>);
	}
}

export default Blog;