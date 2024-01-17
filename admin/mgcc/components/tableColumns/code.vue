<script setup>
defineProps({
	col: {
		type: Object
		, default: {}
	}
});
</script>

<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">
		<div v-html="scope.row[col.prop]"></div>
	</template>
</el-table-column>
</template>