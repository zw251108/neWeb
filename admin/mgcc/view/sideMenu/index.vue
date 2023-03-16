<template>
<el-scrollbar class="aside-container">
	<el-aside class="left-aside">
		<el-menu class="aside-menu"
		         :default-active="active"
		         :unique-opened="true"
		         :collapse="collapse"
		         @select="selectMenu">
			<template v-for="(menu, index) in menuList">
				<!-- 父节点 -->
				<template v-if="isParent(menu)">
					<el-sub-menu :key="menu.name" :index="menu.name">
						<template #title>
							<icons :name="menu.icon || defaultSetting.icon[index%defaultSetting.icon.length]"></icons>
							<span v-text="menu.name"></span>
						</template>
						<el-menu-item v-for="(subMenu, i) in menu.subMenus"
						              :key="subMenu.link"
						              :index="subMenu.link">
							<icons :name="subMenu.icon || defaultSetting.icon[i%defaultSetting.icon.length]"></icons>
							<span v-text="subMenu.name"></span>
						</el-menu-item>
					</el-sub-menu>
				</template>
				<template v-else>
					<el-menu-item :key="menu.link" :index="menu.link">
						<icons :name="menu.icon || defaultSetting.icon[index%defaultSetting.icon.length]"></icons>
						<span v-text="menu.name"></span>
					</el-menu-item>
				</template>
			</template>
		</el-menu>
		<div @click="collapseChange"
		     class="collapse">
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
		, headerHeight: {
			type: String
			, default: '56px'
		}
	})
	, emit = defineEmits(['select-menu', 'collapse-change'])
	;
const defaultSetting = {
		icon: ['home-filled'
			, 'setting'
			, 'user'
			, 'phone'
			, 'star'
			, 'goods'
			, 'help'
			, 'picture'
			, 'upload'
			, 'camera'
			, 'video-camera'
			, 'bell'
			, 'list'
			, 'platform'
			, 'operation'
			, 'promotion'
			, 'ticket'
			, 'management'
			, 'share'
			, 'wallet-filled'
		]
	}
	;

function isParent(menu){
	let { subMenus = [] } = menu
		;

	if( subMenus.length > 1 ){
		return true;
	}

	return true;
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

.aside-container {
	position: fixed;
	bottom: 0;
	top: v-bind(headerHeight);
	height: auto;
	z-index: 2;
}

.el-scrollbar {
	overflow: auto;
	height: 100%;
	background-color: $aside-bg-color;
	box-sizing: border-box;

	.el-scrollbar__wrap {
		overflow-x: hidden;
	}
}
.collapse{
	position: absolute;
	bottom: v-bind(headerHeight);
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

.el-aside{
	&.left-aside {
		background-color: $aside-bg-color;
		color: $aside-color;
		width: auto !important;
		transition: width 0.1s;
	}
}

.el-menu{
	&.aside-menu{
		margin-bottom: 121px;
	}

	&.aside-menu,
	&.aside-menu .el-menu--inline {
		background-color: $aside-bg-color;
		border-right: 1px solid $aside-bg-color;
		// 正常展示
		&:not(.el-menu--collapse) {
			width: $aside-open-width;
			// 子菜单
			& > .el-menu-item {
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
}
</style>