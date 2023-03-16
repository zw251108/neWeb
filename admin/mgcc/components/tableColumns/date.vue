<template>
<el-table-column v-bind="col" :key="col.key">
	<template v-slot="scope">{{transDate(col, scope.row)}}</template>
</el-table-column>
</template>

<script setup>
import {inject}                       from 'vue';
import {transDate as transDateCommon} from '../../mixins/colTypeJudge';

defineProps({
	col: {
		type: Object
		, default: {}
	}
});

const $util = inject('$util')
	;

function transDate(col, row){
	return transDateCommon($util, col, row);
}
</script>