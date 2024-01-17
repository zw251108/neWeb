<template>
<el-form label-width="80px"
         label-position="left"
         size="large">
	<el-form-item label="标题">
		<el-input v-model="data.title"
		          placeholder="博客标题"></el-input>
	</el-form-item>
	<el-form-item label="封面">
		<el-input v-model="data.cover"
		          placeholder="博客封面"></el-input>
	</el-form-item>
	<el-form-item label="标签">
		<el-input  v-model="data.tags"
		           type="textarea"
		           resize="none"
		           placeholder="博客标签"
		           :rows="4"></el-input>
	</el-form-item>
	<el-form-item label="简介">
		<code-editor v-model="data.short"
		             lang="html"
		             height="100"></code-editor>
		
	</el-form-item>
	<el-form-item label="文章">
		<code-editor v-model="data.content"
		             lang="html"></code-editor>
	</el-form-item>
	<el-form-item label="发布">
		<el-checkbox v-model="data.status"
		             :true-label="1"
		             :false-label="0">发布</el-checkbox>
	</el-form-item>
	<el-form-item>
		<el-button type="primary"
		           @click="submit">保存</el-button>
	</el-form-item>
</el-form>
</template>

<script setup>
import {ref, inject} from 'vue';
import codeEditor    from 'mgcc/components/codeEditor/index.vue';

const data = ref({
		title: ''
		, content: ''
		, tags: ''
		, short: ''
		, cover: ''
		, status: 0
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
		resData.tags = resData.tags.join();

		data.value = resData
	});
}

function submit(){
	let exec
		, temp = document.createElement('div')
		, short = data.value.short
		;

	if( !short ){
		temp.innerHTML = data.value.content;
		short = temp.textContent.slice(0, 200);
	}

	if( !id.value ){
		exec = $midway.post('/blog/create', {
			data: {
				...data.value
				, short
			}
		});
	}
	else{
		exec = $midway.post('/blog/update', {
			data: {
				id: id.value
				, ...data.value
				, short
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