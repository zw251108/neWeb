<template>
<div v-show="showStatus">
	<div v-show="showStatus==='noData'">
		<slot name="noData"></slot>
	</div>
	<div v-show="showStatus==='noMore'">
		<slot name="noMore"></slot>
	</div>
	<div v-show="showStatus==='loading'">
		<slot name="loading"></slot>
	</div>
	<!--<div class="text-center text-light paddingv50" style="display: none" v-show="!midDataNoMore&&items.length&&html" v-html="html">-->
	<!--</div>-->
	<!--<div style="display: none;" v-show="!midDataNoMore&&!items.length">-->
		<!--<slot></slot>-->
	<!--</div>-->
	<!--<tg-loadding v-show="loading" class="paddingv50"></tg-loadding>-->
</div>
</template>

<script>
import $ from 'jquery';

let $doc = $(document)
	;

export default {
	props: {
		showStatus: {
			type: String
			, default: 'loading'
			// data		有数据可以加载
			// loading	数据正在加载
			// noData	没有数据
			// noMore	没有更多数据
		}
		, pre: {
			type: Number
			, default: 0
		}
	}
	, ready: function(){
		let that = this
			;

		$doc.on('scroll', function(){
			if( that.status === 'data' ){
				let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
					, h = document.documentElement.clientHeight
					, offset = $(that.$el).offset()
					, top = offset.top
					;

				if( top < scrollTop + h + that.pre ){
					// loadMore 组件到达加载位置
					that.loadMore();
				}
			}
		});
	}
	, methods: {
		loadMore: function(){
			// 向上级发送事件
			this.$dispatch('loadMore');
		}
	}
}
</script>