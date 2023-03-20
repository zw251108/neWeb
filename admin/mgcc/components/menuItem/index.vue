<template>
<template v-if="isParent(menu)">
	<el-sub-menu :key="menu.name"
	             :index="menu.name">
		<template #title>
			<icons :name="menu.icon"></icons>
			<span v-text="menu.title"></span>
		</template>
		<template #default>
			<template v-for="subMenu in menu.children">
	            <menu-item v-if="isParent(subMenu)"
	                       :menu="subMenu"></menu-item>
				<template v-else>
					<el-menu-item :key="subMenu.name"
					              :index="subMenu.name">
						<icons :name="subMenu.icon"></icons>
						<span v-text="subMenu.title"></span>
					</el-menu-item>
				</template>
			</template>
		</template>
	</el-sub-menu>
</template>
<template v-else>
	<el-menu-item :key="menu.name" :index="menu.name">
		<icons :name="menu.icon"></icons>
		<span v-text="menu.title"></span>
	</el-menu-item>
</template>
</template>

<script setup>
const props = defineProps({
		menu: {
			type: Object
			, default: {}
		}
	})
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
</script>