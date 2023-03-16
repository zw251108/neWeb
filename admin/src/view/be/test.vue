<template>
<div class="container">
	<template v-for="(item, index) in list">
		<div class="block"
		     :style="`width: ${item.percent}%;background: ${item.c};`"></div>
		<div class="bar" v-if="index > 0"
		     @mousedown="check(index)"
		     @mouseup="lose"
		     :style="`transform: translateX(${item.left}%)`"></div>
	</template>
</div>
</template>

<script>
export default {
	name: 'test'
	, created(){
		console.log(1231)
	}
	, data(){
		return {
			list: [{
				value: 30
				, percent: 30
				, left: 0
				, c: 'red'
			}, {
				value: 30
				, percent: 30
				, left: 30
				, c: 'blue'
			}, {
				value: 30
				, percent: 30
				, left: 60
				, c: 'green'
			}, {
				value: 10
				, percent: 10
				, left: 90
				, c: 'cyan'
			}]
			, current: 0
		}
	}
	, methods: {
		check(index){
			this.current = index;

			document.addEventListener('mousemove', this.mousemove);
			document.addEventListener('mouseup', this.mouseup);
		}
		, lose(){
			document.removeEventListener('mousemove', this.mouseup);
			document.removeEventListener('mouseup', this.mouseup);
		}
		, mousemove(){

		}
		, mouseup(){

		}
	}
};
</script>

<style>
.container{
	width: 1000px;
	display: flex;
	height: 200px;
}
.block{
	flex-shrink: 0;
	height: 200px;
}
.bar{
	position: absolute;
	left: 0;
	top: -5px;
	height: 210px;
	width: 10px;
}
</style>