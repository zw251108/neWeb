<script setup>
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
		<template v-for="tag in scope.row[col.prop]">
			<el-tag>{{tag}}</el-tag>
		</template>
	</template>
</el-table-column>
</template>