<template>
<div class="mask mask-transparent center" @click="remove()">
	<div class="notice">
		<i v-show="iconName" class="icon-{{iconName}}"></i>
		<div v-html="text"></div>
	</div>
</div>
</template>

<script>
export default {

};
</script>