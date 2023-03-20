<template>
<el-scrollbar class="aside-container">
	<el-aside class="left-aside">
		<div class="aside-logo">
			<a href="/public">
				<img v-if="!collapse"
				     src="/src/images/tgfe.png" alt="">
				<img v-else src="/src/images/TGFE.jpg" alt="">
			</a>
		</div>
		<el-menu class="aside-menu"
		         :default-active="active"
		         :unique-opened="true"
		         :collapse="collapse"
		         @select="selectMenu">
			<menu-item v-for="(menu, index) in menuList"
			           :menu="menu"></menu-item>
		</el-menu>
		<div class="collapse"
		     @click="collapseChange">
			<icons :name="collapse ? 'd-arrow-right' : 'd-arrow-left'"></icons>
		</div>
	</el-aside>
</el-scrollbar>
</template>

<script setup>
const props = defineProps({
		active: {
			type: String
			, default: ''
		}
		, menuList: {
			type: Array
			, default: []
		}
		, collapse: {
			type: Boolean
			, default: false
		}
	})
	, emit = defineEmits(['select-menu', 'collapse-change'])
	;

function isParent(menu){
	let { showAlways
		, children = [] } = menu
		;

	if( children.length > 0 ){
		return true;
	}

	return !!showAlways;
}

function selectMenu(index, path){
	emit('select-menu', index, path);
}

function collapseChange(){
	emit('collapse-change');
}
</script>
<style lang="scss">
@import "../../style/scss/variable";

.root-container {
	background-color: #fff;
	height: 100%;

	.right-container {
		position: relative;
		min-height: 100%;
		width: 100%;
		flex: 1;
		transition: margin-left 0.3s;

		box-sizing: border-box;

		.main-container {
			height: 100%;
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

	&.aside-min .aside-logo img{
		width: 45px;
	}
}

.el-scrollbar {
	overflow: auto;
	height: 100%;
	background-color: $aside-bg-color;
	box-sizing: border-box;

	.el-table__body-wrapper > &{
		background: transparent;
	}

	>>> .el-scrollbar__wrap {
		overflow-x: hidden;
	}
}
.collapse{
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 65px;
	background: #001529;
	font-size: 30px;
	line-height: 65px;
	text-align: center;

	&:hover{
		background: #2d8cf0;
	}

	.el-icon{
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		margin: auto;
		--font-size: 30px;
	}
}

.el-aside.left-aside {
	background-color: $aside-bg-color;
	color: $aside-color;
	width: auto !important;
	transition: width 0.1s;

	& > .aside-logo {
		height: $header-height;
		display: flex;
		margin: 10px;
		justify-content: center;
		align-items: center;
	}
}

.el-menu.aside-menu{
	margin-bottom: 121px;
}
.el-menu.aside-menu,
.el-menu.aside-menu .el-menu--inline {
	background-color: $aside-bg-color;
	border-right: 1px solid $aside-bg-color;
	// 正常展示
	&:not(.el-menu--collapse) {
		width: $aside-open-width;
		// 子菜单
		& > .el-menu-item {
			overflow: hidden;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
			text-overflow: ellipsis;

			color: $aside-color;
			// 子菜单被选中
			&.is-active {
				background: $aside-menu-bg-color-active !important;
				color: $aside-menu-color-active !important;

				& > i {
					color: $aside-menu-color-active;
				}
			}

			// 子菜单鼠标悬浮
			&:hover {
				background-color: $aside-menu-bg-color-hover;
				color: $aside-menu-color-hover;

				& > i {
					color: $aside-menu-color-hover;
				}
			}
		}

		// 父菜单
		& > .el-sub-menu {
			// 父菜单标题
			& > .el-sub-menu__title {
				color: $aside-color;

				& > i {
					color: $aside-color;
				}
			}

			// 父菜单鼠标悬浮
			& > .el-sub-menu__title:hover {
				background-color: $aside-menu-bg-color-hover;
				color: $aside-menu-color-hover;

				& > i {
					color: $aside-menu-color-hover;
				}
			}

			// 父菜单中有被选中
			&.is-active {
				& > .el-sub-menu__title {
					background-color: $aside-bg-color;
					color: $aside-menu-color-active;

					& > i {
						color: $aside-menu-color-active;
					}
				}
			}
		}
	}

	// 最小化
	&.el-menu--collapse {
		// 单独标签
		& >  li.el-menu-item {
			& >  i {
				color: $aside-menu-min-color;
			}

			&.is-active,
			&:hover {
				background: $aside-menu-min-bg-color;
			}
		}

		// 复合标签
		& >  li.el-sub-menu{
			&.is-active {
				background: $aside-menu-bg-color-active;
			}

			& > .el-sub-menu__title {
				text-align: center;

				&:hover {
					& > i:first-child {
						color: $aside-menu-bg-color-active;
					}
				}

				& > * {
					display: none;
				}

				& > i:first-child {
					color: $aside-menu-min-color;
					display: inline;
				}
			}
		}
	}
}
</style>