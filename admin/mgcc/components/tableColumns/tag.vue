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
<el-table-column v-bind="col"
                 :key="col.key">
	<template v-slot="scope">
		<template v-for="tag in getRowValue(col, scope.row)">
			<el-tag>{{tag}}</el-tag>
		</template>
	</template>
</el-table-column>
</template>