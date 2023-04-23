import {useState, useEffect, useRef} from 'react';

import handleArticle, {handleImg} from '../components/handleArticle/index.js';
import api                        from '../api/index.js';

function Editor({id}){
	const
		[ editor, setEditor ] = useState({
			tags: []
		})
		, resultRef = useRef( null )
		, htmlRef = useRef( null )
		, cssRef = useRef( null )
		, jsRef = useRef( null )
	    ;

	useEffect(()=>{
		api.get(`/editor/${id}`).then(({data})=>{
			setEditor( data );
		});
	}, [id]);

	useEffect(()=>{
		let htmlEl = htmlRef.current
			, cssEl = cssRef.current
			, jsEl = jsRef.current
			, resultEl = resultRef.current
			, frame = document.createElement('iframe')
			, temp = document.createElement('div')
			;

		temp.innerHTML = editor.html;
		temp.querySelectorAll('img').forEach( handleImg );

		frame.src = URL.createObjectURL( new Blob([`<!DOCTYPE html>
<html lang="cmn">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
<title>前端代码运行结果</title>
<style>${editor.css || ''}</style>
</head>
<body>
${temp.innerHTML || ''}
<script src="https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.min.js"></script>
<script>${editor.js || ''}</script>
</body>
</html>`], {
			type: 'text/html'
		}) );

		resultEl.append( frame );

		handleArticle( htmlRef );
		handleArticle( cssRef );
		handleArticle( jsRef );

		return ()=>{
			htmlEl.removeChild( htmlEl.firstChild );
			cssEl.removeChild( cssEl.firstChild );
			jsEl.removeChild( jsEl.firstChild );
			resultEl.removeChild( resultEl.firstChild );
		};
	}, [editor]);

	return (<div className="module editor">
		<div className="module_title">{editor.name}</div>
		<div className="module_content">
			<div className="grid-container percent">
				<div className="editor_part editor_result">
					<h3>运行展示</h3>
					<div ref={resultRef}></div>
				</div>
				<div className="editor_part editor_html">
					<h3>HTML 代码</h3>
					<div ref={htmlRef}>
						<textarea data-code-type="html"
						          value={editor.html}></textarea>
					</div>
				</div>
				<div className="editor_part editor_css">
					<h3>CSS 代码</h3>
					<div ref={cssRef}>
						<textarea data-code-type="css"
						          value={editor.css}></textarea>
					</div>
				</div>
				<div className="editor_part editor_js">
					<h3>JavaScript 代码</h3>
					<div ref={jsRef}>
						<textarea data-code-type="js"
						          value={editor.js}></textarea>
					</div>
				</div>
			</div>
			<div className="module_info">
				<div className="module_tags">
					{editor.tags.map((name)=>{
						return (<span key={name}
						              className="tag">{name}</span>);
					})}
				</div>
				<div className="module_datetime">{editor.createDate}</div>
			</div>
		</div>
	</div>);
}

export default Editor;