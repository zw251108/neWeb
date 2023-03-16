<template>
<div>
	<code-editor></code-editor>
</div>
</template>

<script>
import codeEditor from '../../components/codeEditor/index.vue';
                   console.log(1231)
export default {
	name: 'enum'
	, components: {
		codeEditor
	}
	, created(){
		console.log(1)
		console.log(111, this.$el)
		this.$nextTick(()=>{
			console.log(222, this.$el);
		})
	}
};
</script>