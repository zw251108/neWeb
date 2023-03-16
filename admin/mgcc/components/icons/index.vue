<template>
<el-icon>
	<component :is="name"></component>
</el-icon>
</template>

<script>
import * as icons from '@element-plus/icons-vue';

export default {
	name: 'index'
	, components: {
		...icons
	}
	, props: {
		name: {
			type: String
			, default: ''
		}
	}
};
</script>