<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">
		<el-image v-if="getRowValue(col, scope.row)"
		          :src="imgPath(getRowValue(col, scope.row))"
		          fit="contain" />
	</template>
</el-table-column>
</template>

<script setup>
import {imgPath}     from '../../config.js';
import {getRowValue} from '../../mixins/colTypeJudge/index.js';

defineProps({
	col: {
		type: Object
		, default: {}
	}
});
</script>