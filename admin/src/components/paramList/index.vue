<template>
<el-form-item label-width="80px" label="额外参数" style="overflow:hidden;">
	<el-button size="large" @click="addParam">添加参数</el-button>
</el-form-item>
<div class="param-item" v-for="(param, index) in list">
	<el-button @click="deleteParam(param, index)"
	           class="param-item_del"
	           type="danger"
	           size="small" circle>
		<icons name="delete"></icons>
	</el-button>
	<el-form-item label="参数名称">
		<el-input size="large" v-model="param.name"></el-input>
	</el-form-item>
	<el-form-item label="默&ensp;认&ensp;值">
		<el-input size="large" v-model="param.value"></el-input>
	</el-form-item>
	<el-form-item label="描&emsp;&emsp;述">
		<el-input size="large" v-model="param.desc"></el-input>
	</el-form-item>
</div>
</template>

<script setup>
const props = defineProps({
		list: {
			type: Array
			, default: []
		}
	})
	, emit = defineEmits(['add-param', 'del-param'])
	;

function addParam(){
	emit('add-param', props.list);
}
function deleteParam(param, index){
	emit('del-param', param, index, props.list);
}
</script>

<style lang="scss">
.param-item{
	overflow: hidden;
	position: relative;
	margin: -40px -10px 0;
	padding: 40px 10px 0;

	&:hover{
		background: #fff;
		outline: 1px dashed #c0c0c0;

		.param-item_del{
			display: block;
		}
	}
}
.param-item_del{
	display: none;
	position: absolute;
	top: 5px;
	right: 5px;
}
</style>