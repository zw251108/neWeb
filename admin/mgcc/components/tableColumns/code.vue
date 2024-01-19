<script setup>
import {getRowValue} from '../../mixins/colTypeJudge/index.js';

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
		<div v-html="getRowValue(col, scope.row)"></div>
	</template>
</el-table-column>
</template>