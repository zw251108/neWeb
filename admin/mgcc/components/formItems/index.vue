<template>
<el-form :label-position="labelPosition"
         :rules="rules"
         size="large"
         ref="formRef"
         :inline="inline"
         :model="form">
	<div class="form_item" v-for="([param, col], index) in formItems">
		<el-form-item v-if="!param.hidden"
		              :label="param.label"
		              :prop="param.alias || param.prop">
			<template v-if="isEnum(col)">
				<template v-if="param.enumMultiple">
					<el-checkbox-group v-if="param.enumType===1"
					                   v-model="form[param.alias || param.prop]">
						<template v-for="(val, k) in col.enumTarget">
							<el-checkbox v-if="val"
							             :label="`${k}`">{{val}}</el-checkbox>
						</template>
					</el-checkbox-group>
					<el-select v-else-if="param.enumType===2"
					           v-model="form[param.alias || param.prop]"
					           clearable
					           multiple>
						<template v-for="(val, k) in col.enumTarget">
							<el-option v-if="val"
							           :label="val"
							           :value="`${k}`"></el-option>
						</template>
					</el-select>
				</template>
				<template v-else>
					<template v-if="param.enumType===1"
					          v-for="(val, k) in col.enumTarget">
						<el-checkbox v-if="val"
						             v-model="form[param.alias || param.prop]"
						             :true-label="`${k}`"
						             :false-label="''">{{val}}</el-checkbox>
					</template>
					<el-select v-else-if="param.enumType===2"
					           v-model="form[param.alias || param.prop]"
					           clearable>
						<template v-for="(val, k) in col.enumTarget">
							<el-option v-if="val"
							           :label="val"
							           :value="`${k}`"></el-option>
						</template>
					</el-select>
				</template>
			</template>
			<el-date-picker v-else-if="isDate(col)"
			                v-model="dateModels[param.alias || param.prop]"
			                :type="decideType(col.dateFormat)"
			                :format="transFormat(col.dateFormat)"></el-date-picker>
			<code-editor v-else-if="isCode(col)"
			             v-model="form[param.alias || param.prop]"
			             lang="html"
			             height="100"></code-editor>
			<el-input v-else
			          v-model="form[param.alias || param.prop]"></el-input>
		</el-form-item>
		<slot :index="index" :item="formItems[index]" :form-items="formItems" :form="form"></slot>
	</div>
	<slot name="btns"></slot>
</el-form>
</template>

<script setup>
import {reactive, watch, inject, ref, toRef} from 'vue';
import {isEnum, isDate, isCode}              from '../../mixins/colTypeJudge';
import codeEditor                            from '../codeEditor/index.vue';

const props = defineProps({
		form: {
			type: Object
			, default: {}
		}
		, formItems: {
			type: Array
			, default: []
		}
		, rules: {
			type: Object
			, default: {}
		}
		, inline: {
			type: Boolean
			, default: false
		}
		, labelPosition: {
			type: String
			, default: 'left'
		}
		, mode: {
			type: String
			, default: 'edit'
		}
	})
	, formItems = toRef(props, 'formItems')
	, dateModels = reactive({})
	, $util = inject('$util')
	, formRef = ref(null)
	;

watch(formItems, (value)=>{
	value.forEach(([param, col])=>{
		if( isDate(col) ){
			let key = param.alias || param.prop
				;

			dateModels[key] = new Date( props.form[key] );
		}
	});
}, {
	immediate: true
});

watch(()=>{
	return {
		...dateModels
	};
}, (state)=>{
	Object.entries( state ).forEach(([key, date])=>{
		let col = props.formItems.find(([{alias, prop}])=>{
				return alias === key || prop === key;
			})[1]
			;

		props.form[key] = (date && date instanceof Date) ?$util.dateFormat(date, col.dateFormat) : '';
	});
});

// el-date-picker 中 format HH 是对应的占位
function transFormat(format){
	return format ? format.replace(/hh/g, 'HH') : undefined;
}

// 判断是日期选择器还是日期时间选择器
function decideType(format){
	if( /hh/.test(format) || /mm/.test(format) || /ss/.test(format) ){
		return 'datetime';
	}

	return 'date';
}

function changeCheckbox(v){    console.log(v)
	// props.form[prop] = v;
	props.form.state = v;
}

defineExpose({
	reset(){
		Object.keys( dateModels ).forEach((key)=>{
			dateModels[key] = null;
		});

		formRef.value.resetFields();
	}
});
</script>

<style>
.el-form--inline .form_item{
	display: inline-block;
}
.form_item .el-form-item__label{
	width: 6em;
}
</style>