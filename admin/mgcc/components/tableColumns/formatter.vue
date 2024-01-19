<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">
		{{col.formatterHandler(col.prop ? getRowValue(col, scope.row) : undefined, scope.row, scope.$index, data)}}
	</template>
</el-table-column>
</template>

<script setup>
import {getRowValue} from '../../mixins/colTypeJudge/index.js';

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