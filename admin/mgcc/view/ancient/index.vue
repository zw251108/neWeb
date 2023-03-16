<template>
<div id="oldVersion">
	<div id="applicationHost">
		<div id="index-main" style="overflow:hidden;">
			<div id="rightside" style="margin-left: 0;padding-top: 0;">
				<div class="page-wrapper" id="wrapper" data-bind="router: {}"></div>
			</div>
		</div>
	</div>
</div>
</template>

<script setup>
import {toRef, reactive, watch, onMounted, onUnmounted} from 'vue';

const props = defineProps({
		config: {
			type: Object
			, default: {}
		}
	})
	, config = toRef(props, 'config')
	, styleList = reactive([])
	;

function init(config){
	let dom = document.querySelectorAll('div.panel:not(.datagrid)')
		;

	dom.forEach((dom)=>{
		dom.remove();
	});

	try{
		const r = window.requirejs
			,
			{ path: filePath } = config
			, fileName = filePath.slice(1).split('/').join('.')
			;

		r(['app/main', 'app/shell'], (app, routerData)=>{
			let alias = routerData.find(({route})=>{
					return route === fileName;
				})
				, htmlPath
				, jsPath
				;

			if( alias ){
				let { moduleId } = alias
					;

				htmlPath = `text!app/${moduleId}.html`;
				jsPath = `app/${moduleId}`;
			}
			else{
				htmlPath = `text!app${filePath}/${fileName}.html`;
				jsPath = `app${filePath}/${fileName}`;
			}

			app.then(()=>{
				r([htmlPath, jsPath], (html, {attached})=>{
					document.getElementById('wrapper').innerHTML = html;

					attached();

					console.log(`加载 ${filePath}/${fileName}`);
				});
			});
		});
	}
	catch(e){
		console.log( e );
	}
}

init( props.config );

watch(config, init);

onMounted(()=>{
	let { style } = props.config
		;

	if( style ){
		style.forEach((path)=>{
			let link = document.createElement('link')
				;

			link.rel = 'stylesheet';
			link.href = path;

			document.head.appendChild( link );

			styleList.push( link );
		});
	}
});

onUnmounted(()=>{
	styleList.forEach((link)=>{
		document.head.removeChild( link );
	});
});
</script>
<script>
export default{
	name: 'ancient'
};
</script>