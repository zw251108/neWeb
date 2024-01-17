<template>
<el-table-column :label="col.label"
                 :align="col.align"
                 :width="col.width"
                 :key="col.key">
	<template v-slot="scope">{{toFixed(scope.row[col.prop], col.toFixed)}}</template>
</el-table-column>
</template>

<script setup>
defineProps({
	col: {
		type: Object
		, default: {}
	}
});

function toFixed(v, fixed){
	if( fixed ){
		return (v || 0).toFixed( fixed );
	}

	return v;
}
</script>