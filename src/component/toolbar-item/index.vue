<template>
<li>
	<button class="icon"
			:id="id"
			:class="'icon-'+ icon"
			:title="title"
			@click="click($event, eventTopic, id, icon)"
			v-text="text"></button>
</li>
</template>

<script>
export default {
	props: {
		id: {
			type: String
			, default: ''
		}
		, icon: {
			type: String
			, default: 'settle'
		}
		, title: {
			type: String
			, default: ''
		}
		, text: {
			type: String
			, default: ''
		}
		, eventTopic: {
			type: String
			, default: ''
		}
	}
	, methods: {
		click(e, id, icon){
			// todo 触发事件
		}
	}
};
</script>