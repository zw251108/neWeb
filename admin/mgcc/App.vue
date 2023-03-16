<template>
<el-config-provider :locale="locale">
	<el-container class="root-container"
	              :class="collapse ? 'aside-min' : 'aside-max'">
		<top-header :current-top-menu="currentTopMenu"
		            :top-menu="topMenu"
		            :username="username"
		            :old-version="oldVersion"
		            :height="headerHeight"
		            :bg="headerBg"
		            :logo="logo"
		            @logout="logout"
		            @rollback="rollback"
		            @go-feature="goFuture"
		            @change-menu-list="changeMenuList"></top-header>
		<side-menu :active="active"
		           :menu-list="menuList"
		           :collapse="collapse"
		           :header-height="headerHeight"
		           @select-menu="selectMenu"
		           @collapse-change="collapseChange"></side-menu>
		<div class="right-container">
			<header class="header-bar"></header>
			<div class="tag-nav-wrapper"></div>
			<div class="main-container">
				<keep-alive :exclude="excludeComLive"
				            v-if="currentRouter">
					<component :is="currentRouter"
					           :config="pageConfig"></component>
				</keep-alive>
			</div>
		</div>
	</el-container>
</el-config-provider>
</template>

<script>
import { ElConfigProvider } from 'element-plus';
import locale from 'element-plus/es/locale/lang/zh-cn';

export default {
	name: 'App'
	, components: {
		[ElConfigProvider.name]: ElConfigProvider
	}
	, data(){
		return {
			// 中文
			locale

			// 顶部 header 相关
			, oldVersion: this.$ls.sync.getData('oldVersion')
			, currentTopMenu: 0
			, topMenu: []
			, username: ''
			, headerHeight: '56px'
			, headerBg: '#333'
			, logo: ''

			// 侧边菜单
			, collapse: false
			, active: ''
			, menuList: []
			, fromMenu: false

			// 主内容区
			// todo 默认首页
			, currentRouter: ''
			, pageConfig: {}

			// keep alive
			, excludeComLive: [
				'ancient'
				, 'virtual'
			]
		};
	}
	, created(){
	}
	, methods: {
		// 选择菜单
		selectMenu(index, paths){
			let target = paths[paths.length -1]
				;

			if( target === this.active ){   // 点击为当前激活菜单
				return ;
			}

			this.$ss.setData('topMenu', this.currentTopMenu);

			this.fromMenu = true;

			this.$router.go( target );
		}
		// 侧边菜单展开收起
		, collapseChange(){
			this.collapse = !this.collapse;
		}

		// 切换菜单
		, changeMenuList(item, index){
			this.currentTopMenu = index;
			this.menuList = item.subMenus;
		}
		// 退出登录
		, logout(){
			this.$cookie.removeData('backToken', 'user');
			this.$url.changePage(`${this.$auth.LOGIN_PATH}?redirect=${encodeURIComponent(location.href)}`);
		}
		// 修改密码
		, changePwd(form){
			this.$auth.changePwd.post( form ).then(()=>{
				this.$alert('密码修改成功！', {
					type: 'info'
				});
			});
		}
		// 版本回退
		, rollback(){
			this.oldVersion = true;
			this.$ls.setData('oldVersion', true);
		}
		// 使用新版本
		, goFuture(){
			this.oldVersion = false;
			this.$ls.setData('oldVersion', false);
		}
	}
};
</script>

<style lang="scss">
@import "style/scss/variable";

html,
body {
	font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
	"Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	margin: 0;
	padding: 0;
	height: 100%;
	width: 100%;
	// overflow-x: hidden;
	// overflow: auto;
}

#app {
	height: 100%;
	width: 100%;
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	//text-align: center;
	color: #2c3e50;
}

.root-container {
	background-color: #fff;
	height: 100%;

	.right-container {
		position: relative;
		min-height: 100%;
		width: 100%;
		flex: 1;
		transition: margin-left 0.3s;
		padding-top: v-bind(headerHeight);

		box-sizing: border-box;

		.main-container {
			width: 100%;
			padding: 20px;
			
			box-sizing: border-box;
		}
	}

	&.aside-max > .right-container {
		padding-left: $aside-open-width;
	}

	&.aside-min > .right-container {
		padding-left: $aside-min-width;
	}
}
</style>