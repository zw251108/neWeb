<template>
<div class="component"
     v-for="(item, index) in data">
     <div class="component-btns">
	     <el-button @click="upComponent(item, index, data)"
	                size="small" circle>
		     <icons name="arrow-up"></icons>
	     </el-button>
	     <el-button @click="downComponent(item, index, data)"
	                size="small" circle>
		     <icons name="arrow-down"></icons>
	     </el-button>
	     <el-button @click="setComponent(item, index, data)"
	                type="primary"
	                size="small" circle>
		     <icons name="tools"></icons>
	     </el-button>
	     <el-button @click="delComponent(item, index, data)"
	                type="danger"
	                size="small" circle>
		     <icons name="delete"></icons>
	     </el-button>
	</div>
	<div class="component-name"
	     v-text="`component: ${item.name}`"></div>
	<div class="component-preview"
	     v-if="item.preview">
		<img :src="item.preview" alt="">
	</div>
	<div class="component-slot"
	     v-for="slot in item.slots"
	     @drop.stop="dropSlotComponent($event, slot)">
		<div class="component-slot-name" v-text="`slot: ${slot.name}`"></div>
		<component-tree v-if="slot.children && slot.children.length"
		                :data="slot.children"
		                @del-component="delComponent"
		                @up-component="upComponent"
		                @down-component="downComponent"
		                @drop-slot-component="dropSlotComponent"></component-tree>
	</div>
	<div>

	</div>
</div>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
		data: {
			type: Array
			, default: []
		}
	})
	, data = reactive( props.data )
	;

const emit = defineEmits(['del-component', 'set-component', 'up-component', 'down-component', 'drop-slot-component'])
	;

// 删除组件
function delComponent(item, index, list){
	emit('del-component', item, index, list);
}
// 向上移
function upComponent(item, index, list){
	emit('up-component', item, index, list);
}
// 向下移
function downComponent(item, index, list){
	emit('down-component', item, index, list);
}
// 放入
function dropSlotComponent(event, slot){
	emit('drop-slot-component', event, slot);
}
// 设置
function setComponent(item, index, list){
	emit('set-component', item, index, list);
}
</script>

<style lang="scss">
.component{
	position: relative;
	min-height: 40px;
	border: 1px solid #e1e1e1;
	border-radius: 10px;
	margin: 5px;
	padding: 5px;
	//outline-offset: -5px;
}
.component-btns{
	position: absolute;
	top: 10px;
	right: 10px;
	text-align: right;
}
.component-name{
	height: 30px;
	margin-top: 10px;
	text-indent: 1em;
}
.component-preview{
	img{
		max-width: 100%;
	}
}
.component-slot{
	overflow: hidden;
	min-height: 100px;
	border: 1px dashed #c0c0c0;
	border-radius: 10px;

	margin-top: 10px;

	&:hover, &.is-hover{
		//background: #efefef;
		border-color: #2D8cF0;
	}
}
.component-slot-name{
	height: 30px;
	margin: 10px 10px 0;
	text-indent: 1em;
}
</style>