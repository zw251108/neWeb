<template>
<div class="searchBar"
      v-if="searchItems.length">
	<form-items :inline="true"
	            label-position="right"
	            size="large"
	            ref="searchForm"
	            :form="searchForm"
	            :form-items="searchItems">
		<template #btns>
			<el-form-item class="form_item-block">
				<el-button @click="reset">重置</el-button>
				<el-button @click="search" type="primary">搜索</el-button>
			</el-form-item>
		</template>
	</form-items>
</div>
<toolbars v-if="toolbars.length"
          :toolbars="toolbars"
          @click-btn="clickBtn"></toolbars>
<el-table border
          stripe
          ref="table"
          :data="data"
          :height="height"
          @selection-change="selectChange">
	<template v-for="col in cols">
		<component v-if="!col.hidden"
		           :is="decideColType(col)"
		           :col="col"
		           :data="data"
		           @click-col-btn="clickColBtn"
		           @edit-col-start="editColStart"
		           @edit-col-end="editColEnd"></component>
	</template>
</el-table>
<el-pagination style="margin-top: 10px;"
               background
               layout="total, sizes, prev, pager, next, jumper"
               :current-page="params[fetch.page]"
               :page-size="params[fetch.size]"
               :pager-count="11"
               :total="count"
               @current-change="changePage"
               @size-change="changePageSize">
</el-pagination>
<el-dialog :title="btnDialog.config.popupTitle"
           :close-on-click-modal="false"
           :close-on-press-escape="false"
           :show-close="false"
           :model-value="btnDialog.show">
	<form-items :form="btnDialog.form"
	            :form-items="btnDialog.formItems"></form-items>
	<template #footer>
		<el-button @click="cancelBtnDialog">取消</el-button>
		<el-button @click="handleBtnDialog" type="primary">{{btnDialog.config.confirmBtnDesc || '确认'}}</el-button>
	</template>
</el-dialog>
</template>

<script>
import handleInjectMixin from '../../mixins/handleInject';
import colTypeJudgeMixin from '../../mixins/colTypeJudge';
import formItems         from '../../components/formItems/index.vue';
import toolbars          from '../../components/toolbars/index.vue';

export default {
	name: 'virtual'
	, props: {
		config: {
			type: Object
			, default: {}
		}
	}
	, mixins: [handleInjectMixin, colTypeJudgeMixin]
	, components: {
		formItems
		, toolbars
	}
	, data(){
		return {
			cols: []
			, toolbars: []
			, searchItems: []
			, searchForm: {}
			, fetch: {}
			, fetchTimer: null
			, params: {}

			, data: []
			, count: 0

			, selectRows: []
			, backupColValue:  ''

			, btnDialog: {
				show: false
				, config: {}
				, formItems: []
				, form: {}
			}
		};
	}
	, created(){
		this.init();
	}
	, methods: {
		init(){
			let { fetch = {}
				, cols = []
				, toolbars = []
				, searchItems = [] } = this.config
				;

			Promise.all([
				this.fetchEnumData( cols )
				, this.fetchFormatterData( cols )
			]).then(()=>{
				cols.forEach((col)=>{
					if( this.isFormatter(col) ){
						this.handleFormatter( col );
					}
					else if( this.isEnum(col) ){
						this.handleEnum( col );
					}
					else if( this.isOperate(col) ){
						col.btns.forEach( this.handleRowBtnDisplay );
					}

					col.key = col.key || col.prop || col.type;
				});

				this.fetch = fetch;
				this.cols = cols;
				this.toolbars = toolbars;

				this.toolbars.forEach( this.handleBtnDisplay );

				this.searchItems = searchItems.map((item)=>{
					let col = cols.find((col)=>{
							return item.prop === col.prop;
						})
						;

					return [item, col];
				});

				this.initFetchParams();
				this.fetchData();
				this.resetSearchForm(true);
			});
		}
		, initFetchParams(){
			let { page, start
				, size, pageSize
				, extQuery = [] } = this.fetch
				, params = extQuery.reduce((rs, {name, value})=>{
					rs[name] = this.handleInjectParams( value );

					return rs;
				}, {})
				, urlParams = this.$urlParams()
				, urlEntries = Object.entries( urlParams )
				, isAll
				;

			start = urlParams[page] || this.handleInjectParams( start ) || start || 1;
			pageSize = urlParams[size] || this.handleInjectParams( pageSize ) || pageSize || 20;

			this.params = {
				[page]: start
				, [size]: pageSize
				, ...params
			};

			// 当页码初始值大于 1 时，设置数据总数，否则 pagination 组件会将页码重置为 1
			if( start > 1 ){
				this.count = start * pageSize;
			}

			// url 上还有其它参数，初始化搜索条件
			isAll = urlEntries.every(([key, value])=>{
				if( key in this.params ){
					// 判断当前 hash 上的值是否和 config 里的参数相同
					// 传过来的初始值都是字符串类型，urlParams 会对参数 JSON.parse，会造成类型不同
					return this.params[key] === value
						|| this.params[key] === `${value}`;
				}
				else{
					// 当前 url 中是否有搜索条件的字段
					return !this.searchItems.find(([{prop, alias}])=>{
						return (alias || prop) === key;
					});
				}
			});

			// hash 上还有其它参数，初始化搜索条件
			if( !isAll ){
				this.resetSearchForm(true);

				this.handleFetchParams();
			}
		}
		, resetSearchForm(init){
			this.searchForm = this.searchItems.reduce((rs, [param, col])=>{
				let { prop
					, alias
					, inject } = param
					, key = alias || prop
					;

				// 搜索初始值只能从 urlParams 上获取
				if( this.isEnum(col) && param.enumMultiple ){
					rs[key] = (init && inject) ? (this.handleInjectParams(`$urlParams.${key}`) || '').split(',') : [];
				}
				else{
					rs[key] = (init && inject) ? this.handleInjectParams(`$urlParams.${key}`) : undefined;
				}

				return rs;
			}, {});
		}
		, handleFetchParams(){
			this.params = Object.entries({
				...this.params
				, ...this.searchForm
			}).reduce((rs, [key, value])=>{
				if( value || value === 0 ){
					rs[key] = value
				}

				return rs;
			}, {});
		}
		, setParams(data){
			let temp = this.$url
				;

			temp.clearParams();
			temp.replaceParams( data );
		}
		, fetchData(){
			let { main, mainMethod
				, count, countMethod } = this.fetch
				, queue = []
				;

			if( !(main && main.url) ){
				this.data = [];

				return Promise.resolve();
			}

			// 复制参数，防止全局拦截器影响
			let data = {
					...this.params
				}
				;

			try{
				queue.push( this[`$${main.project}`][mainMethod.toLowerCase()](main.url, {
					data
				}) );

				if( count && count.url ){
					queue.push( this[`$${count.project}`][countMethod.toLowerCase()](count.url, {
						data
					}) );
				}

				// 当前请求参数会放入到 urlParams 中
				this.setParams( data );

				return Promise.all( queue ).then(([dataRes, countRes={}])=>{
					let { data } = dataRes
						,
						{ data: count } = countRes
						;

					if( Array.isArray(data) ){
						if( !count ){
							count = data.length;
						}
					}
					else if( typeof data === 'object' ){
						count = data.total;
						data = data.rows;
					}
					else if( !dataRes.success ){
						this.$message({
							type: 'error'
							, message: dataRes.message
						});

						this.data = [];
						this.count = 0;

						return Promise.reject();
					}
					else{
						this.$message({
							type: 'error'
							, message: '错误的数据类型'
						});

						return Promise.reject();
					}

					this.data = data;
					this.count = count;
				});
			}
			catch(e){
				this.$alert(`${main.project} 为未知项目`, {
					type: 'error'
				});

				return Promise.reject();
			}
		}
		, fetchEnumData(cols){
			let enumIds = cols.reduce((rs, col)=>{
					if( this.isEnum(col) && col.enumId ){
						rs.push( col.enumId );
					}

					return rs;
				}, [])
				;

			if( enumIds.length ){
				return this.$midway.codeGetByIds({
					ids: Array.from( new Set(enumIds) )
				}).then(({data=[]})=>{
					cols.forEach((col)=>{
						if( !this.isEnum(col) || !col.enumId ){
							return ;
						}

						let enumCode = data.find(({id})=>{
								return col.enumId === id;
							})
							;

						col.enumCode = enumCode.code;
					});
				});
			}
			else{
				return Promise.resolve();
			}
		}
		, fetchFormatterData(cols){
			let formatterIds = cols.reduce((rs, col)=>{
					if( this.isFormatter(col) && col.formatterId ){
						rs.push( col.formatterId );
					}

					return rs;
				}, [])
				;

			if( formatterIds.length ){
				return this.$midway.codeGetByIds({
					ids: Array.from( new Set(formatterIds) )
				}).then(({data=[]})=>{
					cols.forEach((col)=>{
						if( !this.isFormatter(col) || !col.formatterId ){
							return ;
						}

						let formatterCode = data.find(({id})=>{
								return col.formatterId === id;
							})
							;

						col.formatterCode = formatterCode.code;
					});
				});
			}
			else{
				return Promise.resolve();
			}
		}

		, handleBtnDisplay(btn){
			if( btn.displayList ){
				this.handleDisplayList( btn );
			}
			else if( btn.displayCode ){
				btn.displayHandler = new Function('search', 'params', 'hash', btn.displayCode);
			}
		}
		, handleRowBtnDisplay(btn){
			if( btn.displayList ){
				this.handleDisplayList( btn );
			}
			else if( btn.displayCode ){
				btn.displayHandler = new Function('r', 'i', 'data', btn.displayCode);
			}
		}
		, handleDisplayList(btn){
			if( Array.isArray(btn.displayList) ){ // 或关系
				btn.displayHandler = function(r){
					return btn.displayList.some((item)=>{
						return Object.entries( item ).every(([prop, match])=>{
							return r[prop] === match;
						});
					});
				};
			}
			else if( typeof btn.displayList === 'object' ){   // 并关系
				btn.displayHandler = function(r){
					return Object.entries( btn.displayList ).every(([prop, match])=>{
						return r[prop] === match;
					});
				};
			}
			else{   // 非正常数据
				btn.displayHandler = function(){
					return true;
				};
			}
		}

		, selectChange(rows){
			this.selectRows = rows;
		}

		, clickBtn(btn){
			if( btn.select && !this.selectRows.length ){
				this.$alert('至少选择一行数据进行操作', {
					type: 'error'
				});

				return ;
			}
			else if( btn.select && (!btn.multiple && this.selectRows.length > 1) ){
				this.$alert('只能操作一行数据', {
					type: 'error'
				});

				return ;
			}

			this.btnHandler(btn, this.selectRows);

			console.log(`点击了全局 ${btn.title} 按钮`);
		}
		, clickColBtn(btn, btnIndex, row, rowIndex){
			console.log(`点击了第 ${rowIndex} 行的 ${btn.title} 按钮`);

			this.btnHandler(btn, [row]);
		}
		, btnHandler(btn, rows){
			let executor
				;

			if( [1, 3].includes(btn.type) ){
				if( btn.confirm ){
					executor = this.$alert(btn.confirmDesc || '确定执行操作？', {
						type: 'warning'
						, confirmButtonText: btn.confirmBtnDesc || '确认'
						, showCancelButton: true
					});
				}
				else{
					executor = Promise.resolve();
				}

				executor.then(()=>{
					let params = this.handleParams(btn.params, rows)
						, ext = (btn.extQuery || []).reduce((rs, {name, value})=>{
							rs[name] = value

							return rs;
						}, {})
						, data = {
							...params
							, ...ext
						}
						;

					if( btn.type === 1 ){
						this[`$${btn.url.project}`][btn.method.toLowerCase()](btn.url.url, {
							data
						}).then(()=>{
							this.fetchData();
						}, ()=>{

						});
					}
					else if( btn.type === 3 ){
						let url = btn.url.url
							;

						if( btn.open ){
							let query = this.$url.packQuery( data )
								;

							if( /\?/.test(url) ){
								query = query.replace(/^\?/, '&');
							}

							window.open(`${url}${query}`);
						}
						else{
							this.$router.go(url, data);
						}
					}
				}, ()=>{});
			}
			else if( btn.type === 2 ){ console.log(btn)
				let config = btn
					, row = rows[0]
					, formItems = btn.params.map((param)=>{
						let col = this.cols.find((col)=>{
								return param.prop === col.prop
							})
							;

						return [param, col];
					})
					, form = formItems.reduce((rs, [param, col])=>{
						let { prop
							, alias
							, inject } = param
							;

						if( !param.hidden && col && this.isEnum(col) && param.enumMultiple ){
							rs[alias || prop] = inject ? (row[prop] || '').split(',') : [];
						}
						else{
							rs[alias || prop] = inject ? row[prop] : '';
						}

						return rs;
					}, {})
					;

				btn.extQuery.forEach(({name, value, desc})=>{
					formItems.push([{
						prop: name
						, label: desc
					}, {
						prop: name
						, type: 'text'
					}]);
					form[name] = value;
				});

				this.btnDialog = {
					show: true
					, config
					, form
					, formItems
				};
			}
		}

		, handleParams(params, rows){
			return params.reduce((rs, {prop, alias})=>{
				let name = alias ? alias : prop
					;

				rs[name] = rows.map((row)=>{
					return this.getRowValue({
						prop
					}, row);
				}).join();

				return rs;
			}, {});
		}

		, editColStart($event, prop, col, row){
			// 将值备份
			this.backupColValue = row[prop];
		}
		, editColEnd($event, prop, col, row){
			let data = this.handleParams(col.params, [row])
				;

			this[`$${col.url.project}`][col.method.toLowerCase()](col.url.url, {
				data
			}).then(()=>{

			}, ()=>{
				// 错误处理，将值还原为备份的值
				col[prop] = this.backupColValue;
			});
		}

		, cancelBtnDialog(){
			this.btnDialog.show = false;
		}
		, handleBtnDialog(){
			let btn = this.btnDialog.config
				,
				{ url } = btn
				;

			this[`$${url.project}`][btn.method.toLowerCase()](url.url, {
				data: this.btnDialog.form
			}).then(()=>{
				this.fetchData();
			});

			this.btnDialog.show = false;
		}

		, changePage(start){
			this.params[this.fetch.page] = start;

			if( this.fetchTimer ){
				clearTimeout( this.fetchTimer );
			}

			this.handleFetchParams();

			this.fetchData();
		}
		, changePageSize(pageSize){
			this.params[this.fetch.size] = pageSize;

			// 因为改变 pageSize 可能也会触发改变 start 参数，所以加一个定时器，确定不会发送多个请求
			if( this.fetchTimer ){
				clearTimeout( this.fetchTimer );
			}

			this.fetchTimer = setTimeout(()=>{
				this.handleFetchParams();

				this.fetchData();
			}, 300);
		}

		// 搜索调
		, reset(){
			this.resetSearchForm();

			this.$refs.searchForm.reset();
		}
		, search(){
			this.params[this.fetch.page] = 1;

			this.handleFetchParams();

			this.fetchData();
		}
	}
	, watch: {
		config(val){
			if( !val ){
				return ;
			}

			this.init();
		}
	}
	, computed: {
		enToolbars(){
			return this.toolbars.filter(({displayHandler})=>{
				return !displayHandler || displayHandler(this.searchForm, this.$urlParams(), this.$hashParams());
			});
		}
		, height(){
			// todo 计算更复杂
			if( this.searchItems.length && this.toolbars.length ){
				return 700;
			}
			else if( this.searchItems.length ){
				return 771;
			}
			else{
				return 917;
			}
		}
	}
};
</script>

<style>
.searchBar{
	border: 1px dashed #c0c0c0;
	margin-bottom: 10px;
	padding: 10px 0 0 10px;
	background: #f9f9f9;
}
.toolbars{
	border-bottom: 1px solid #dcdfe6;
	margin-bottom: 10px;
	padding: 10px 0;
}
.cell .el-checkbox__inner{
	height: 20px;
	width: 20px;
}
.cell .el-checkbox__input.is-indeterminate .el-checkbox__inner::before{
	top: 8px;
}
.cell .el-checkbox__inner::after{
	left: 6px;
	height: 12px;
	width: 4px;
}
.cell .el-tag{
	margin: 5px;
}
.el-select__caret:before{
	font-size: 20px;
}
.el-select-dropdown .el-scrollbar {
	background-color: transparent;
}
.form_item-block{
	width: 100%;
}
.form_item-block .el-form-item__content{
	justify-content: center;
}
</style>