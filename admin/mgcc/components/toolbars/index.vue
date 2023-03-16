<template>
<div class="toolbars">
	<div class="toolbars_item" v-for="(btn, index) in toolbars">
		<el-button @click="clickBtn(btn, index)"
		           size="large"
		           v-bind="btn.props">{{btn.title}}</el-button>
		<slot :index="index" :item="btn" :toolbars="toolbars"></slot>
	</div>
	<slot name="setting"></slot>
</div>
</template>

<script setup>
defineProps({
	toolbars: {
		type: Array
		, default: []
	}
});

const emit = defineEmits(['click-btn'])
	;

function clickBtn(btn, index){
	emit('click-btn', btn, index);
}
</script>
<style lang="scss">
.toolbars{
	margin-bottom: 20px;
}
.toolbars_item{
	display: inline-block;
	margin-right: 20px;
}
</style>