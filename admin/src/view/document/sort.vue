<template>
<div>
	<el-form size="large">
		<el-form-item>
			<el-button type="primary"
			           @click="save">保存</el-button>
		</el-form-item>
	</el-form>
	<div class="sortItem" v-for="(item, index) in list">
		<icons name="arrow-up"
		       @click="up(item, index)"></icons>
		<icons name="arrow-down"
		       @click="down(item, index)"></icons>
		<span v-text="item.title"></span>
	</div>
</div>
</template>

<script setup>
import {ref, reactive, inject} from 'vue';

const list = reactive([])
	, $hashParams = inject('$hashParams')
	,
	{ documentId
	, sectionId }= $hashParams()
	, $alert = inject('$alert')
	, $midway = inject('$midway')
	, page = ref(0)
	, tempList = []
	;

function fetch(){
	let exec
		;

	page.value++;

	if( documentId ){
		exec = $midway.get('/document/section/list', {
			data: {
				documentId
				, page: page.value
				, size: 100
			}
		});
	}
	else if( sectionId ){
		exec = $midway.get('/document/content/list', {
			data: {
				sectionId
				, page: page.value
				, size: 100
			}
		});
	}
	else{
		exec = Promise.reject();
	}

	exec.then(({data})=>{
		tempList.push( ...data );

		if( data.length < 100 ){
			let t

			if( documentId ){
				t = data[0].document.sectionOrder.split(',');
			}
			else{
				t = data[0].section.contentOrder.split(',');
			}

			t = t.map((order)=>{
				return tempList.find(({id})=>{
					return +order === id;
				});
			});

			list.push( ...t );
		}
		else{
			fetch();
		}
	});
}

fetch();

function up(item, index){
	if( index === 0 ){
		return ;
	}

	list.splice(index, 1);
	list.splice(index -1, 0, item);
}

function down(item, index){
	if( index === list.length -1 ){
		return ;
	}

	list.splice(index, 1);
	list.splice(index +1, 0, item);
}

function save(){
	let exec
		;

	if( documentId ){
		exec = $midway.post('/document/sort', {
			data: {
				id: documentId
				, sectionOrder: list.map(({id})=>{
					return id;
				}).join()
			}
		});
	}
	else if( sectionId ){
		exec = $midway.post('/document/section/sort', {
			data: {
				id: sectionId
				, contentOrder: list.map(({id})=>{
					return id;
				}).join()
			}
		});
	}
	else{
		exec = Promise.reject();
	}

	exec.then(({code})=>{
		if( code === 0 ){
			$alert('保存成功', {
				type: 'success'
			});
		}
		else{
			$alert('保存失败', {
				type: 'error'
			});
		}
	})
}
</script>
<script>
export default {
	name: 'documentSort'
};
</script>

<style>
.sortItem{
	border: 5px solid #c0c0c0;
	border-radius: 10px;
	margin: 20px 0;
	font-size: 20px;
	line-height: 60px;
}
.sortItem span{
	display: inline-block;
	margin-left: 20px;
}
.sortItem i{
	display: inline-block;
	border: 2px solid #c0c0c0;
	border-radius: 5px;
	margin: 0 20px;
	font-size: 40px;
	vertical-align: middle;
}
</style>