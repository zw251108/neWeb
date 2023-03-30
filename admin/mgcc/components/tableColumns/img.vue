<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">
		<el-image style="width: 100px; height: 100px"
		          :src="imgPath(scope.row[col.prop])"
		          fit="contain" />
	</template>
</el-table-column>
</template>

<script setup>
import {imgPath} from '../../config.js';

defineProps({
	col: {
		type: Object
		, default: {}
	}
});
</script>