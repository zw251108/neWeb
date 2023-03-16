<template>
<el-form label-width="80px"
         label-position="left"
         size="large">
	<el-form-item label="编辑代码">

	</el-form-item>
	<el-form-item label="代码">
		<code-editor v-model="data.code"></code-editor>
	</el-form-item>
	<el-form-item label="描述">
		<el-input v-model="data.description"
		          type="textarea"
		          resize="none"
		          placeholder="描述必填"
		          :row="4"></el-input>
	</el-form-item>
	<el-form-item>
		<el-button type="primary" @click="submit">保存</el-button>
	</el-form-item>
</el-form>
</template>

<script setup>
import {CODE_TYPE}                                        from '../../../mgcc';
import {ref, inject}                                      from 'vue';
import codeEditor                                         from '../../components/codeEditor/index.vue';
import {isEnum, isFormatter, handleEnum, handleFormatter} from '../../../mgcc/mixins/colTypeJudge';

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

function submit(){
	let rs
		;

	if( isEnum(type.value) ){
		rs = handleEnum($alert, {
			...type.value
			, ...data.value
		});
	}
	else if( isFormatter(type.value) ){
		rs = handleFormatter($alert, {
			...type.value
			, ...data.value
		});
	}

	if( !rs ){

	}
}
</script>
<script>
export default {
	name: 'beCode'
};
</script>