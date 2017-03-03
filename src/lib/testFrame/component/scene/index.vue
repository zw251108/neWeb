<template>
<section class="scene tg-scene" v-if="showStatus">
	<slot></slot>
</section>
</template>
<script>
export default {
	props: {
		showStatus: {
			type: Boolean
			, default: true
		}
		, id: {
			type: String
			, default: ''
		}
	}
	, ready: function(){
//	    console.log(this.showStatus);
	}
	, events: {
		sceneToggle: function(){

		}
	}
}
</script>
<style>
.scene{
	/*position: absolute;*/
}
</style>