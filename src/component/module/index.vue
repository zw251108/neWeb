<template>
<section :id="id" class="module" :class="'module-'+ id + ' module-'+ type + ' '+size">
	<h2 class="module_title icon"
		:class="'icon-'+ id"
		v-text="title"
		v-if="title"></h2>
	<slot name="toolbar"></slot>
	<div class="module_content">
		<slot></slot>
	</div>
</section>
</template>

<script>
export default {
	props: {
		id: {
			type: String
			, default: ''
		}
		, size: {
			type: String
			, default: 'normal'
		}
		, type: {
			type: String
			, default: 'main'
		}
		, title: {
			type: String
			, default: ''
		}
	}
};
</script>