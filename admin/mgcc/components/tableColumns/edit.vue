<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">
		<el-input v-model="scope.row[col.prop]"
		          @focus="editColStart($event, col.prop, col, scope.row, scope.$index)"
		          @change="editColEnd($event, col.prop, col, scope.row, scope.$index)"></el-input>
	</template>
</el-table-column>
</template>

<script setup>
defineProps({
	col: {
		type: Object
		, default: {}
	}
});

const emit = defineEmits(['edit-col-start', 'edit-col-end'])
	;

function editColStart(e, prop, col, row, index){
	emit('edit-col-start', e, prop, col, row, index);
}
function editColEnd(e, prop, col, row, index){
	emit('edit-col-end', e, prop, col, row, index);
}
</script>