<template>
<a :href="url">
	<section :id="id" class="metro" :class="'metro-'+ id+ ' '+ size">
		<h2 class="metro_title icon" :class="'icon-'+ icon" v-text="title"></h2>
		<div class="metro_mark m_info" v-text="info"></div>
		<span class="metro_info"></span>
	</section>
</a>
</template>

<script>
export default {
	props: {
		icon: {
			type: String
			, default: ''
		}
		, url: {
			type: String
			, default: '#'
		}
		, id: {
			type: String
			, default: ''
		}
		, size: {
			type: String
			, default: 'normal'
		}
		, title: {
			type: String
			, default: ''
		}
		, info: {
			type: String
			, default: ''
		}
	}
};
</script>