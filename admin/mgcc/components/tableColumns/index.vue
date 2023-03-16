<template>
<el-table-column v-bind="col" :key="col.key"></el-table-column>
</template>

<script setup>
defineProps({
	col: {
		type: Object
		, default: {}
	}
});
</script>