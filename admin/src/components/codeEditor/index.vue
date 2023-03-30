<template>
<textarea ref="editor"></textarea>
</template>

<script setup>
import {ref, nextTick, watch, onMounted, onBeforeUnmount} from 'vue';

import {basicSetup}          from 'codemirror';
import {EditorState}         from '@codemirror/state';
import {EditorView, keymap}  from '@codemirror/view';
import {indentWithTab}       from '@codemirror/commands';
import {javascript}          from '@codemirror/lang-javascript';
import {html}                from '@codemirror/lang-html';
import {css}                 from '@codemirror/lang-css';
import {oneDark}             from '@codemirror/theme-one-dark';
import {abbreviationTracker} from '@emmetio/codemirror6-plugin';

const props = defineProps({
		lang: {
			type: String
			, default: 'js'
		}
		, theme: {
			type: String
			, default: ''
		}
		, readonly: {
			type: Boolean
			, default: false
		}
		, modelValue: {
			type: String
			, default: ''
		}
	})
	, emit = defineEmits(['update:modelValue'])
	;
const editor = ref( null )
	;
let cm = null
	;

onMounted(()=>{
	let config = {
			doc: props.modelValue
			, extensions: [
				basicSetup
				, EditorState.readOnly.of( props.readonly )
				, abbreviationTracker()
				, EditorView.lineWrapping
				, keymap.of([
					indentWithTab
				])
				, EditorView.updateListener.of((view)=>{
					if( view.docChanged ){
						emit('update:modelValue', view.state.doc.toString());
					}
				})
				, oneDark
			]
		}
		;

	switch( props.lang ){
		case 'js':
			config.extensions.push( javascript() );

			break;
		case 'css':
			config.extensions.push( css() );

			break;
		case 'html':
			config.extensions.push( html() );

			break;
		default:
			config = null;

			break;
	}

	if( config ){
		cm = new EditorView({
			state: EditorState.create( config )
		});
		editor.value.parentNode.insertBefore(cm.dom, editor.value);
		editor.value.style.display = 'none';
	}
});


onBeforeUnmount(()=>{
	editor.value.parentNode.removeChild( cm.dom );
});

watch(()=>{
	return props.modelValue;
}, (val)=>{
	if( cm ){
		if( val !== cm.state.doc.toString() ){
			nextTick(()=>{
				let transaction = cm.state.update({
						changes: {
							from: 0
							, insert: val
						}
					})
					;

				cm.dispatch( transaction );
			});
		}
	}
});
</script>
<style>
.cm-editor{
	flex: 1;
	min-height: 500px;
	font-size: 16px;
}
</style>