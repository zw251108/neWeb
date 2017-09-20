<template>
<div class="mask center" :class="theme" style="z-index: 1;">
	<div class="popup popup-alert border-radius" style="position: relative;">
		<button v-if="showClose" type="button" class="icon icon-close pos-a marginb10 popup_close alert_close" @click="cancel"></button>
		<i v-show="iconName" :class="'icon-'+ iconName"></i>
		<div class="margint50 marginb20 paddingh40 fs-18 popup_title alert_title" v-show="title" v-html="title"></div>
		<div class="marginb50 paddingh40 fs-15 popup_content alert_content" v-html="content" :class="{'margint50':!title}"></div>
		<button class="btn pos-a bottom-n0 popup_ok alert_ok" type="button" v-html="okText" @click="cancel"></button>
	</div>
</div>
</template>

<script>
export default {
	methods: {
		cancel(){
			this.$dispatch('alertClose');

			this.$destroy( true );
		}
	}
};
</script>