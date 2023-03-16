<template>
<el-dialog :title="title"
           :close-on-click-modal="false"
           :close-on-press-escape="false"
           :show-close="false"
           :model-value="show">
	<el-table border
	          stripe
	          :data="data"
	          @selection-change="selectChange">
		<el-table-column type="selection"></el-table-column>
		<el-table-column v-for="key in keys"
		                 :label="key.label"
		                 :prop="key.prop">
		</el-table-column>
	</el-table>
	<el-pagination style="margin-top: 10px;"
	               background
	               layout="total, sizes, prev, pager, next, jumper"
	               :current-page="page"
	               :page-size="size"
	               :pager-count="11"
	               :total="count"
	               @current-change="changePage"
	               @size-change="changePageSize"></el-pagination>
	<template #footer>
		<span class="dialog-footer">
			<el-button size="large" @click="cancelSelect">取消</el-button>
			<el-button size="large" @click="select" type="primary">确定</el-button>
		</span>
	</template>
</el-dialog>
</template>

<script setup>
import {toRef, watch}   from 'vue';

const props = defineProps({
		title: {
			type: String
			, default: ''
		}
		, show: {
			type: Boolean
			, default: false
		}
		, data: {
			type: Array
			, default: []
		}
		, keys: {
			type: Array
			, default: []
		}
		, page: {
			type: Number
			, default: 1
		}
		, size: {
			type: Number
			, default: 20
		}
		, count: {
			type: Number
			, default: 0
		}
	})
	, show = toRef(props, 'show')
	, emit = defineEmits(['select', 'cancel-select', 'change-page'])
	;
let selectRows = []
	;

watch(show, ()=>{
	selectRows = [];
});

function cancelSelect(){
	emit('cancel-select');
}
function select(){
	if( !selectRows.length ){
		return ;
	}

	emit('select', selectRows);
}

let changePageTimer = null
	;

function selectChange(rows){
	selectRows = rows;
}
function changePage(page){
	if( changePageTimer ){
		clearTimeout( changePageTimer );

		changePageTimer = null;
	}

	emit('change-page', page, props.size);
}
function changePageSize(size){
	if( changePageTimer ){
		clearTimeout( changePageTimer );

		changePageTimer = null;
	}

	changePageTimer = setTimeout(()=>{
		emit('change-page', props.page, size);
	}, 300);
}
</script>