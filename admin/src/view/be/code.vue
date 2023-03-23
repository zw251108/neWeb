<template>
<el-form label-width="80px"
         label-position="left"
         size="large">
	<el-form-item label="查看代码">

	</el-form-item>
	<el-form-item label="代码">
		<code-editor v-model="data.code"
		             :readonly="true"></code-editor>
	</el-form-item>
	<el-form-item label="描述">
		<el-input v-model="data.description"
		          :readonly="true"
		          type="textarea"
		          resize="none"
		          placeholder="描述必填"
		          :row="4"></el-input>
	</el-form-item>
</el-form>
</template>

<script setup>
import {ref, inject} from 'vue';

import {CODE_TYPE}   from 'mgcc';
import codeEditor    from '../../components/codeEditor/index.vue';
import {isEnum}      from 'mgcc/mixins/colTypeJudge';

const type = ref({})
	, data = ref({})
	, $hashParams = inject('$hashParams')
	, id = ref( $hashParams().id )
	, $alert = inject('$alert')
	, $midway = inject('$midway')
	;

if( id.value ){
	$midway.codeGet({
		id: id.value
	}).then(({data: resData})=>{
		type.value = {
			type: CODE_TYPE[resData.type]
		};

		// 对枚举类型格式化
		if( isEnum(type.value) ){
			resData.code = JSON.stringify(JSON.parse( resData.code ), null, 4);
		}

		data.value = resData;
	});
}
</script>
<script>
export default {
	name: 'beCode'
};
</script>