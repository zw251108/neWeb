import React from 'react';
import maple from 'cyan-maple';

import {basicSetup}         from 'codemirror';
import {EditorState}        from '@codemirror/state';
import {EditorView, keymap} from '@codemirror/view';
import {indentWithTab}      from '@codemirror/commands';
import {html}               from '@codemirror/lang-html';
import {oneDark}            from '@codemirror/theme-one-dark';
import {abbreviationTracker} from '@emmetio/codemirror6-plugin';

import api from '../api/index.js';

class Edit extends React.Component{
	constructor(props){
		super( props );

		this.el = null;
		this.state = {
			id: props.id
			, title: ''
			, content: ''
		};
		this.id = props.id;
		this.init = false;
	}
	componentDidMount(){
		this.state.id && api.get(`/blog/${this.state.id}`, {
			data: {

			}
		}).then((res)=>{
			this.setState( res.data );
			
			let transaction = this.view.state.update({
					changes: {
						from: 0
						, insert: res.data.content
					}
				})
				;
							   
			this.view.dispatch( transaction );
		});

		let temp = this.el.querySelector('textarea')
			;

		this.view = new EditorView({
			state: EditorState.create({
				doc: temp.value
				, extensions: [
					basicSetup
					, html()
					, abbreviationTracker()
					, EditorView.lineWrapping
					, keymap.of([
						indentWithTab
					])
					, oneDark
				]
			})
		});
		temp.parentNode.insertBefore(this.view.dom, temp);
		temp.style.display = 'none';

		window.cm = this.view;
	}

	componentDidUpdate(){
		// if( this.id ){
		// 	return ;
		// }
		//
		// let temp = this.el.querySelector('textarea')
		// 	, state
		// 	;
		//
		// state = EditorState.create({
		// 	doc: temp.value
		// 	, extensions: [
		// 		basicSetup
		// 		, html()
		// 		, oneDark
		// 	]
		// });
		//
		// this.view = new EditorView({
		// 	state
		// });
		// temp.parentNode.insertBefore(this.view.dom, temp);
		// temp.style.display = 'none';
	}

	setTitle(title){
		this.setState({
			title
		});
	}
	setNews(is){
		// this.setState({
		//
		// });
	}

	save(){
		let t = document.createElement('div')
			, content = this.view.state.doc.toString()
			, short
			;

		t.innerHTML = content;
		short = t.innerText.slice(0, 200);

		if( this.id ){
			api.setData(`/blog/${this.id}`, {
				method: 'PUT'
				, data: {
					title: this.state.title
					, content
					, short
				}
			});
		}
		else{
			api.post('/blog', {
				data: {
					title: this.state.title
					, content
					, short
				}
			}).then(({data})=>{
				this.id = data.id;
			});
		}

		  console.log(this.view, this.state.title)
	}

	render(){
		return (<article className="module blog">
			<h2 className="module_title">编辑文章</h2>
			<div className="blog_content" ref={(el)=>{
				this.el = el;
			}}>
				<input type="text"
				       value={this.state.title}
				       onChange={(el)=>{
						   this.setTitle( el.target.value );
					   }}/>
				<textarea value={this.state.content}
				          onChange={()=>{}}></textarea>
				{/*<input type="checkbox"*/}
				{/*       onClick={(el)=>{*/}
				{/*		   this.setNews( el.target.checked );*/}
				{/*	   }}/>*/}
			</div>
			<button onClick={()=>{
				this.save();
			}}>保存</button>
		</article>);
	}
}

export default Edit;