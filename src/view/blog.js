import React from 'react';
import maple from 'cyan-maple';

import {basicSetup, EditorView} from 'codemirror';
import {EditorState}            from '@codemirror/state';
import {javascript}             from '@codemirror/lang-javascript';
import {html}                   from '@codemirror/lang-html';
import {css}                    from '@codemirror/lang-css';
import {oneDark}                from '@codemirror/theme-one-dark';

import api from '../api/index.js';

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
		api.get(`/blog/${this.state.id}`).then((res)=>{
			this.setState( res.data );
		});
	}

	componentDidUpdate(){
		let temp = this.el.querySelectorAll('textarea[data-code-type]')
			;

		temp.forEach((el)=>{
			let codeType = el.dataset.codeType
				, state
				, view
				;

			switch( codeType ){
				case 'js':
					state = EditorState.create({
						doc: el.value
						, extensions: [
							basicSetup
							, javascript()
							, EditorState.readOnly.of(true)
							, oneDark
						]
					});

					break;
				case 'css':
					state = EditorState.create({
						doc: el.value
						, extensions: [
							basicSetup
							, css()
							, EditorState.readOnly.of(true)
							, oneDark
						]
					});

					break;
				case 'html':
					state = EditorState.create({
						doc: el.value
						, extensions: [
							basicSetup
							, html()
							, EditorState.readOnly.of(true)
							, oneDark
						]
					});

					break;
				default:
					break;
			}

			if( state ){
				view = new EditorView({
					state
				});
				el.parentNode.insertBefore(view.dom, el);
				el.style.display = 'none';
			}
		});
	}

	render(){
		return (<article className="module blog">
			<h3 className="module_title">{this.state.title}</h3>
			<div className="blog_content"
			     ref={(el)=>{this.el = el;}}
			     dangerouslySetInnerHTML={{__html: this.state.content}}></div>
			<div className="blog_datetime">{maple.util.dateFormat(new Date( this.state.createDate ), 'YYYY-MM-DD hh:mm:ss')}</div>
		</article>);
	}
}

export default Blog;