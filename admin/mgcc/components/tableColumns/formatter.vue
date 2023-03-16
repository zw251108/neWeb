<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">
		{{col.formatterHandler(col.prop ? scope.row[col.prop] : undefined, scope.row, scope.$index, data)}}
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
</script>