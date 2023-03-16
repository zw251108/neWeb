<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">
		<template v-for="(btn, i) in col.btns">
			<el-button v-if="!btn.displayHandler || btn.displayHandler(scope.row, scope.$index, data)"
			           size="large"
			           @click="clickColBtn(btn, i, scope.row, scope.$index)">{{btn.title}}</el-button>
		</template>
	</template>
</el-table-column>
</template>

<script setup>
defineProps({
	col: {
		type: Object
		, default: {}
	}
	, data: {
		type: Array
		, default: []
	}
});

const emit = defineEmits(['click-col-btn'])
	;

function clickColBtn(btn, index, row, $index){
	emit('click-col-btn', btn, index, row, $index);
}
</script>