<template>
<el-header class="header-container"
           @mouseenter="showTopMenu=true"
           @mouseleave="showTopMenu=false">
	<div class="header-logo">
		<a href="/public">
			<img :src="logo" alt="">
		</a>
	</div>
	<div class="header-setting">
		<div v-text="`你好，${username}`"></div>
		<div v-if="!oldVersion"
		     @click="rollback">回旧版本</div>
		<div v-else
		     @click="goFuture">用新版本</div>
		<div @click="logout">退出系统</div>
		<slot name="operates"></slot>
<!--		<div @click="showChangePwd">修改密码</div>-->
	</div>
	<div v-show="showTopMenu" class="top-menu">
		<div v-for="(item, index) in topMenu"
		     class="top-menu-item"
		     :class="`${index===currentTopMenu ? 'top-menu-item-active' : ''}`"
		     @click="changeMenuList(item, index)">
			<icons :name="topMenuIconList[index]"></icons>
			<span v-text="item.name"></span>
		</div>
	</div>
</el-header>
<!--<el-dialog title="修改密码"-->
<!--           :close-on-click-modal="false"-->
<!--           :close-on-press-escape="false"-->
<!--           :show-close="false"-->
<!--           :model-value="pwdDialog.show">-->
<!--	<el-form class="changePwd"-->
<!--	         label-width="100px"-->
<!--	         :model="pwdDialog.form"-->
<!--	         :rules="rules">-->
<!--		<el-form-item label="原始密码：" prop="password">-->
<!--			<el-input v-model="pwdDialog.form.password" show-password></el-input>-->
<!--		</el-form-item>-->
<!--		<el-form-item label="重设密码：" prop="newPwd">-->
<!--			<el-input v-model="pwdDialog.form.newPwd" show-password></el-input>-->
<!--		</el-form-item>-->
<!--		<el-form-item label="确认密码：" prop="confirmPwd">-->
<!--			<el-input v-model="pwdDialog.form.confirmPwd" show-password></el-input>-->
<!--		</el-form-item>-->
<!--	</el-form>-->
<!--	<template #footer>-->
<!--		<el-button @click="cancelChange">取消</el-button>-->
<!--		<el-button @click="changePwd"-->
<!--		           type="primary">确认</el-button>-->
<!--	</template>-->
<!--</el-dialog>-->
</template>

<script setup>
import {ref, reactive, inject} from 'vue';

const props = defineProps({
		topMenu: {
			type: Array
			, default: []
		}
		, currentTopMenu: {
			type: Number
			, default: ''
		}
		, username: {
			type: String
			, default: ''
		}
		, oldVersion: {
			type: Boolean
			, default: false
		}
		, height: {
			type: String
			, default: '56px'
		}
		, bg: {
			type: String
			, default: '#333'
		}
		, logo: {
			type: String
			, default: ''
		}
	})
	, emit = defineEmits([
		'logout'
		, 'rollback'
		, 'go-feature'
		, 'change-menu-list'
		// , 'change-pwd'
	])
	;
const $alert = inject('$alert')
	, topMenuIconList = [
		'home-filled'
		, 'shopping-bag'
		, 'shopping-cart'
		, 'ship'
		, 'shopping-cart-full'
		, 'money'
		, 'user'
		, 'phone'
		, 'setting'
		, 'search'
		, 'van'
	]
	;

function logout(){
	emit('logout');
}

/**
 * 版本切换
 * */
function rollback(){
	emit('rollback');
}
function goFuture(){
	emit('go-feature');
}

/**
 * 切换菜单
 * */
const showTopMenu = ref(false)
	;

function changeMenuList(item, index){
	emit('change-menu-list', item, index);
}

/**
 * 修改密码
 * */
// const required = true
// 	, trigger = 'blur'
// 	, pwdDialog = reactive({
// 		show: false
// 		, form: {
// 			password: ''
// 			, newPwd: ''
// 			, confirmPwd: ''
// 		}
// 	})
// 	, rules = {
// 		password: [{
// 			required
// 			, message: '请输入原始密码'
// 			, trigger
// 		}]
// 		, newPwd: [{
// 			required
// 			, message: '请输入重设密码'
// 			, trigger
// 		}]
// 		, confirmPwd: [{
// 			required
// 			, message: '请输入确认密码'
// 			, trigger
// 		}]
// 	}
// 	;
//
// function showChangePwd(){
// 	pwdDialog.show = true;
// }
// function cancelChange(){
// 	pwdDialog.show = false;
// }
// function changePwd(){
// 	if( pwdDialog.form.newPwd !== pwdDialog.form.confirmPwd ){
// 		$alert('两次密码不同！', {
// 			type: 'error'
// 		});
//
// 		return ;
// 	}
//
// 	pwdDialog.show = false;
//
// 	emit('change-pwd', pwdDialog.form);
// }
</script>
<style lang="scss">
@import "../../style/scss/variable";

.header-container{
	position: fixed;
	display: flex;
	justify-content: space-between;
	left: 0;
	right: 0;
	z-index: 3;
	height: v-bind(height);
	border-bottom: 4px solid #ffa800;
	background-color: v-bind(bg);
	color: #fff;
	font-size: 12px;

	& > .header-logo {
		display: flex;
		margin: 10px;
		justify-content: center;
		align-items: center;

		a{
			height: calc(v-bind(height) - 16px);
		}
		img{
			margin: 0;
		}
	}

	.header-setting{
		display: flex;
		justify-content: flex-start;
		align-items: center;

		div{
			margin-left: 20px;
			cursor: default;
		}
	}
}
.top-menu{
	position: absolute;
	top: 100%;
	left: 0;
	right: 0;
	display: flex;
	justify-content: flex-start;
	flex-wrap: wrap;

	border-bottom: 4px solid #ffa800;
	padding: 10px;

	background: #dbebfb;
	color: #6a7b8b;

	.el-icon{
		display: block;
		margin: 0 auto 5px;
		font-size: 40px;
	}
}
.top-menu-item{
	text-align: center;
	padding: 5px 20px 10px;

	&:hover{
		opacity: .8;
		color: #000;
	}
}
.top-menu-item-active{
	border-radius: 4px;
	background: rgba(255, 255, 255, .5);
	color: #00a2c9;
}

.changePwd{
	input.el-input__inner{
		height: 40px;
		width: 100%;
		border: 1px solid #dcddfe;
		padding: 0 15px;
		line-height: 40px;
	}
}
</style>