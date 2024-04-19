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
<el-table-column :label="col.label"
                 :align="col.align"
                 :width="col.width"
                 :key="col.key">
	<template v-slot="scope">
		<a :href="getRowValue(col, scope.row)"
		   target="_blank">
			<icons name="link"></icons>
			{{getRowValue(col, scope.row)}}</a>
	</template>
</el-table-column>
</template>