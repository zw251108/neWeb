<template>
<dialog class="module module-popup hidden" open="open"
		:id="id"
		:class="size">
	<toolbar>
		<toolbar-item icon="cancel" event-topic="closePopup"></toolbar-item>
	</toolbar>
	<div class="module_content">
		<slot></slot>
	</div>
	<div class="btnGroup">
		<slot name="button"></slot>
	</div>
</dialog>
</template>

<script>
import toolbar		from '../toolbar/index.vue';
import toolbarItem	from '../toolbar-item/index.vue';
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
	}
	, components: {
		toolbar
		, toolbarItem
	}
};
</script>