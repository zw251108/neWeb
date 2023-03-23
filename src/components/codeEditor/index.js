import {useState, useEffect, useRef} from 'react';

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

function CodeEditor({code, codeType, readonly}){
	const el = useRef(null)
		,
		[ view, setView ] = useState(null)
		;

	useEffect(()=>{
		const current = el.current
			;

		setView( createCodeEditor([
			current
		], readonly)[0] );

		return ()=>{
			view && current.parentNode.removeChild( view.dom );
		}
	}, [code, codeType, readonly, view]);

	return (<textarea data-code-type={codeType}
	                  value={code}
	                  ref={el}></textarea>);
}

function createCodeEditor(list, readonly){
	return Array.from( list ).map((el)=>{
		let codeType = el.dataset.codeType
			, view
			, config = {
				doc: el.value
				, extensions: [
					basicSetup
					, EditorState.readOnly.of( readonly )
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

		return view;
	});
}

export default CodeEditor;

export {
	createCodeEditor
};