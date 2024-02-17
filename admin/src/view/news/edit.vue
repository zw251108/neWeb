<script setup>
import {ref, inject} from 'vue';
import codeEditor    from 'mgcc/components/codeEditor/index.vue';

const data = ref({
		content: ''
		, targetId: ''
		, status: 0
	})
	, $hashParams = inject('$hashParams')
	, id = ref( $hashParams().id )
	, $alert = inject('$alert')
	, $midway = inject('$midway')
	;

if( id.value ){
	$midway.get(`/news/get`, {
		data: {
			id: id.value
		}
	}).then(({data: resData})=>{
		resData.content = JSON.stringify(resData.content, null, 4);

		data.value = resData
	});
}


function submit(){
	let exec
		, content = data.value.content
		;

	try{
		content = eval(`(${content || {}})`);
	}
	catch(e){
		$alert('代码格式错误', {
			type: 'error'
		});

		return;
	}

	if( !id.value ){
		exec = $midway.post('/news/create', {
			data: {
				...data.value
				, content
			}
		});
	}
	else{
		exec = $midway.post('/news/update', {
			data: {
				id: id.value
				, ...data.value
				, content
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
	name: 'newsEdit'
};
</script>

<template>
<el-form label-width="80px"
         label-position="left"
         size="large">
	<el-form-item label="内容">
		<code-editor v-model="data.content"
		             lang="html"></code-editor>
	</el-form-item>
	<el-form-item label="内容源 ID">
		<el-input v-model="data.targetId"
		          placeholder="内容源 ID"></el-input>
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