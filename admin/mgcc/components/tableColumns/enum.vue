<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">{{col.enumHandler(scope.row)}}</template>
</el-table-column>
</template>

<script setup>
defineProps({
	col: {
		type: Object
		, default: {}
	}
});
</script>