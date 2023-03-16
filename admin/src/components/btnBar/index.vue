<template>
<toolbars class="toolbars-setting"
          :toolbars="toolbars"
          @click-btn="clickBtn">
	<template #default="scope">
		<div class="toolbars_item_setting">
			<el-button @click="goLeft(scope.item, scope.index, scope.toolbars)"
			           size="small" circle>
				<icons name="arrow-left"></icons>
			</el-button>
			<el-button @click="goRight(scope.item, scope.index, scope.toolbars)"
			           size="small" circle>
				<icons name="arrow-right"></icons>
			</el-button>
			<el-button @click="editBtn(scope.item, scope.index, scope.toolbars)"
			           type="primary"
			           size="small" circle>
				<icons name="tools"></icons>
			</el-button>
			<el-button @click="deleteBtn(scope.item, scope.index, scope.toolbars)"
			           type="danger"
			           size="small" circle>
				<icons name="delete"></icons>
			</el-button>
		</div>
	</template>
	<template #setting>
		<div class="toolbars_item toolbars_add">
			<el-button @click="addBtn"
			           size="large"
			           type="primary">添加操作按钮</el-button>
		</div>
	</template>
</toolbars>
</template>

<script setup>
const props = defineProps({
		toolbars: {
			type: Array
			, default: []
		}
	})
	, emit = defineEmits(['add-btn', 'go-left', 'go-right', 'edit-btn', 'del-btn', 'click-btn'])
	;

// 添加操作按钮
function addBtn(){
	emit('add-btn', props.toolbars);
}
// 向左移
function goLeft(btn, index, toolbars){
	emit('go-left', btn, index, toolbars);
}
// 向右移
function goRight(btn, index, toolbars){
	emit('go-right', btn, index, toolbars);
}
// 编辑操作按钮
function editBtn(btn, index, toolbars){
	emit('edit-btn', btn, index, toolbars);
}
// 删除操作按钮
function deleteBtn(btn, index, toolbars){
	emit('del-btn', btn, index, toolbars);
}
// 点击按钮
function clickBtn(btn, index){
	emit('click-btn', btn, index);
}
</script>
<style lang="scss">
.toolbars-setting{
	.toolbars_item{
		position: relative;
		display: inline-block;
		margin-right: 20px;
		padding: 40px 40px 0 0;

		&:hover{
			outline: 1px dashed #c0c0c0;
			outline-offset: 10px;

			.toolbars_item_setting{
				display: flex;
				width: 100%;
				justify-content: flex-end;
				flex-wrap: wrap;
			}
		}

		.el-button{
			position: relative;
			z-index: 1;
		}
	}

	.toolbars_add{
		&:hover{
			outline: none;
		}
	}
}
.toolbars_item_setting{
	display: none;
	position:absolute;
	top: 0;
	right: 0;
	margin-top: -10px;
	z-index: 0;

	.el-button{
		margin-top: 10px;
	}
}
</style>