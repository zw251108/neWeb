<template>
<el-form label-width="80px"
         label-position="left"
         size="large">
	<el-form-item label="标题">
		<el-input v-model="data.title"
		          placeholder="博客标题"></el-input>
	</el-form-item>
	<el-form-item label="文章">
		<code-editor v-model="data.content"
		             lang="html"></code-editor>
	</el-form-item>
	<el-form-item>
		<el-button type="primary"
		           @click="submit">保存</el-button>
	</el-form-item>
</el-form>
</template>

<script setup>
import {ref, inject} from 'vue';
import codeEditor    from '../../components/codeEditor/index.vue';

const data = ref({
		title: ''
		, content: ''
	})
	, $hashParams = inject('$hashParams')
	, id = ref( $hashParams().id )
	, $alert = inject('$alert')
	, $midway = inject('$midway')
	;

if( id.value ){
	$midway.get(`/blog/get`, {
		data: {
			id: id.value
		}
	}).then(({data: resData})=>{
		data.value = resData
	});
}

function submit(){
	let exec
		;

	if( !id.value ){
		exec = $midway.post('/blog/create', {
			data: {
				...data.value
			}
		});
	}
	else{
		exec = $midway.post('/blog/update', {
			data: {
				id: id.value
				, ...data.value
			}
		});
	}

	exec.then(({code, data})=>{
		if( code === 0 ){
			if( !id.value ){
				id.value = data.id;
			}

			$alert('保存成功', {
				type: 'success'
			});
		}
		else{
			$alert('保存失败', {
				type: 'error'
			});
		}
	});
}
</script>
<script>
export default {
	name: 'blogEdit'
};
</script>