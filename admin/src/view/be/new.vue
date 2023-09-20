<template>
<el-row>
	<el-col style="margin-bottom: 20px;"
	        :span="24">
		<el-steps finish-status="success" simple
		          :active="step">
			<el-step v-for="step in steps" :title="step"></el-step>
		</el-steps>
	</el-col>
	
	<template v-if="step===0">
		<el-col :span="12">
			<el-form label-width="80px" size="large" :model="fetch" :rules="rules">
				<el-form-item label="查询接口" prop="mainPath">
					<el-input placeholder="请输入数据查询接口"
					          v-model="fetch.mainPath"></el-input>
				</el-form-item>
				<el-form-item label="查询类型">
					<el-radio v-for="method in supportedMethods"
					          :label="method"
					          v-model="fetch.mainMethod">{{method}}</el-radio>
				</el-form-item>
				<el-form-item label="统计接口" prop="countPath">
					<el-input v-model="fetch.countPath"
					          placeholder="请输入数据统计接口"></el-input>
				</el-form-item>
				<el-form-item label="统计类型">
					<el-radio v-for="method in supportedMethods"
					          :label="method"
					          v-model="fetch.countMethod">{{method}}</el-radio>
				</el-form-item>
				<el-form-item label="页码变量" prop="page">
					<el-input v-model="fetch.page"
					          placeholder="请输入页码变量名称"></el-input>
				</el-form-item>
				<el-form-item label="开始页码" prop="start">
					<el-input v-model="fetch.start"
					          placeholder="请输入起始页码"></el-input>
				</el-form-item>
				<el-form-item label="数量变量" prop="size">
					<el-input v-model="fetch.size"
					          placeholder="请输入每页数量变量名称"></el-input>
				</el-form-item>
				<el-form-item label="每页数量" prop="pageSize">
					<el-input v-model="fetch.pageSize"
					          placeholder="请输入每页数量"></el-input>
				</el-form-item>
				<param-list :list="fetch.extQuery"
				            @add-param="addParam"
				            @del-param="deleteItem"></param-list>
				<el-form-item>
					<el-button @click="goFetch" type="primary">渲染数据表格</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="12" style="padding: 10px 20px;">
			<el-form label-position="top" size="large">
				<el-form-item label="数据结构模板">
					<code-editor v-model="dataTemplate"></code-editor>
				</el-form-item>
			</el-form>
		</el-col>
	</template>

	<el-col v-else-if="step===1"
	        :span="24">
		<div class="settings">
			<el-button v-if="showPrevStep()"
			           @click="prevStep">上一步</el-button>
			<el-button v-if="showNextStep()"
			           @click="nextStep">下一步</el-button>
		</div>

		<div class="setSearchBar">
			搜索条
			<el-switch v-model="hasSearchBar"
			           inline-prompt
			           active-text="有"
			           inactive-text="无"></el-switch>
			<el-button v-if="hasSearchBar"
			           @click="initSearchBar"
			           type="danger"
			           style="margin-left: 20px;">初始化搜索条</el-button>
		</div>
		<div class="searchBar">
			<form-items class="searchBar_form"
			            v-if="hasSearchBar"
			            ref="searchForm"
			            :inline="true"
			            label-position="right"
			            :form="searchForm"
			            :form-items="searchItems">
				<template #default="scope">
					<div class="searchBar_item_setting">
						<el-button @click="goLeft(scope.item, scope.index, scope.formItems)"
						           size="small" circle>
							<icons name="arrow-left"></icons>
						</el-button>
						<el-button @click="goRight(scope.item, scope.index, scope.formItems)"
						           size="small" circle>
							<icons name="arrow-right"></icons>
						</el-button>
						<el-button @click="editSearchItem(scope.item, scope.index, scope.formItems, scope.form)"
						           type="primary"
						           size="small" circle>
							<icons name="tools"></icons>
						</el-button>
						<el-button @click="deleteItem(scope.item, scope.index, scope.formItems)"
						           type="danger"
						           size="small" circle>
							<icons name="delete"></icons>
						</el-button>
					</div>
				</template>
				<template #btns>
					<el-form-item class="form_item-block">
						<el-button @click="reset">重置</el-button>
						<el-button @click="search" type="primary">搜索</el-button>
					</el-form-item>
				</template>
			</form-items>
		</div>

		<btn-bar :toolbars="toolbars"
		         @add-btn="addBtn"
		         @go-left="goLeft"
		         @go-right="goRight"
		         @edit-btn="editBtn"
		         @del-btn="deleteBtn"
		         @click-btn="clickBtn"></btn-bar>
		<toolbars :toolbars="enToolbars"
		          @click-btn="clickBtn">
		</toolbars>

		<el-table border
		          stripe
		          ref="table"
		          :data="data"
		          @selection-change="selectChange">
			<el-table-column width="109">
				<template #header>
					<el-button @click="setTable"
					           type="primary"
					           size="small" circle>
						<icons name="tools"></icons>
					</el-button>
				</template>
				<el-table-column width="109">
					<template #header>
						<el-button @click="addCol" type="primary">添加列</el-button>
					</template>
				</el-table-column>
			</el-table-column>
			<el-table-column v-for="(col, index) in cols"
			                 :key="col.key">
				<template #header v-if="!isSpecialCol(col)">
					<el-button @click="colGoLeft(index, col)"
					           size="small" circle>
						<icons name="arrow-left"></icons>
					</el-button>
					<el-button @click="colGoRight(index, col)"
					           size="small" circle>
						<icons name="arrow-right"></icons>
					</el-button>
					<el-button @click="editCol(col)"
					           type="primary"
					           size="small" circle>
						<icons name="tools"></icons>
					</el-button>
					<el-button @click="deleteCol(col, index, cols)"
					           type="danger"
					           size="small" circle>
						<icons name="delete"></icons>
					</el-button>
				</template>
				<el-table-column>
					<template #header v-if="!isSpecialCol(col)">
						<div style="margin-bottom: 20px;"
						     v-text="`字段：${col.prop || col.label || ''}`"></div>
						<el-input v-model="col.label"
						          placeholder="请输入列头"
						          size="large"></el-input>
					</template>
<!--						 使用 component 表格内容未显示，原因未知。。。 -->
<!--					<component :is="decideColType(col)"-->
<!--					           :col="col"-->
<!--					           :data="data"-->
<!--					           @click-col-btn="clickColBtn"-->
<!--					           @edit-col-start="editColStart"-->
<!--					           @edit-col-end="editColEnd"></component>-->
					<el-table-column v-bind="col"
					                 :label="col.hidden ? `隐藏列 ${col.label || ''}` : (col.label || '&nbsp;')">
						<template v-if="isOperate(col)"
						          v-slot="scope">
							<template v-for="(btn, i) in col.btns">
								<el-button v-if="!btn.displayHandler || btn.displayHandler(scope.row, scope.$index, data)"
								           size="large"
								           @click="clickColBtn(btn, i, scope.row, scope.$index)">{{btn.title}}</el-button>
							</template>
						</template>
						<template v-else-if="isDate(col)"
						          v-slot="scope">{{transDate(col, scope.row)}}</template>
						<template v-else-if="isFormatter(col)"
						          v-slot="scope">{{col.formatterHandler(col.prop ? scope.row[col.prop] : undefined, scope.row, scope.$index, data)}}</template>
						<template v-else-if="isEnum(col)"
						          v-slot="scope">{{col.enumHandler(scope.row)}}</template>
						<template v-else-if="isEdit(col)"
						          v-slot="scope">
							<el-input v-model="scope.row[col.prop]"
							          @focus="editColStart($event, col.prop, col, scope.row, scope.$index)"
							          @change="editColEnd($event, col.prop, col, scope.row, scope.$index)"></el-input>
						</template>
						<template v-else-if="isNumber(col)"
						          v-slot="scope">{{col.toFixed ? (scope.row[col.prop] || 0).toFixed(col.toFixed) : scope.row[col.prop]}}</template>
						<template v-else-if="isImage(col)"
						          v-slot="scope">
							<el-image v-if="scope.row[col.prop]"
							          :src="path(scope.row[col.prop])"
							          fit="contain" />
						</template>
					</el-table-column>
				</el-table-column>
			</el-table-column>
		</el-table>
		<el-pagination :current-page="params[fetch.page]"
		               :page-size="params[fetch.size]"
		               :pager-count="11"
		               :total="count"
		               @current-change="changePage"
		               @size-change="changePageSize"
		               style="margin-top: 10px;"
		               background
		               layout="total, sizes, prev, pager, next, jumper">
		</el-pagination>

		<el-dialog :title="btnDialog.config.popupTitle"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="btnDialog.show">
			<form-items :form="btnDialog.form"
			            :form-items="btnDialog.formItems"></form-items>
			<template #footer>
				<el-button size="large" @click="cancelBtnDialog">取消</el-button>
				<el-button @click="handleBtnDialog" type="primary">{{btnDialog.config.confirmBtnDesc || '确认'}}</el-button>
			</template>
		</el-dialog>

		<el-dialog :title="`设置列 ${editColPopup.edit.prop || ''} ${editColPopup.edit.label || ''}`"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="editColPopup.show">
			<el-form label-width="100px"
			         label-position="left"
			         size="large"
			         :model="editColPopup.edit">
				<el-form-item label="可用字段" v-if="notUseProp.length">
					<el-select v-model="editColPopup.edit.prop"
					           clearable>
						<el-option v-for="prop in notUseProp"
						           :key="prop"
						           :label="prop"
						           :value="prop"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="列头">
					<el-input v-model="editColPopup.edit.label"></el-input>
				</el-form-item>
				<el-form-item label="是否隐藏">
					<el-switch v-model="editColPopup.edit.hidden"
					           inline-prompt
					           active-text="是"
					           inactive-text="否"></el-switch>
					<div style="margin-left: 10px;">设置为隐藏后，列将排在最后</div>
				</el-form-item>
				<template v-if="!editColPopup.edit.hidden">
					<el-form-item label="位置">
						<el-input v-model="editColPopup.position"></el-input>
					</el-form-item>
					<el-form-item label="对齐">
						<el-radio v-model="editColPopup.edit.align" label="left">向左</el-radio>
						<el-radio v-model="editColPopup.edit.align" label="center">居中</el-radio>
						<el-radio v-model="editColPopup.edit.align" label="right">向右</el-radio>
					</el-form-item>
					<el-form-item label="宽度">
						<el-input v-model="editColPopup.edit.newWidth" type="number"></el-input>
					</el-form-item>
				</template>
				<el-form-item label="字段类型">
					<el-select v-model="editColPopup.edit.type"
					           @change="changeColType(editColPopup.edit, $event)"
					           placeholder="请选择字段类型">
						<el-option v-for="type in colType"
						           :key="type.type"
						           :label="type.title"
						           :value="type.type">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="排序" v-if="isSortable(editColPopup.edit)">
					<el-switch v-model="editColPopup.edit.sortable"
					           inline-prompt
					           active-text="是"
					           inactive-text="否"></el-switch>
				</el-form-item>
				<el-form-item label="编辑" v-if="isEditable(editColPopup.edit)">
					<el-switch v-model="editColPopup.edit.editable"
					           inline-prompt
					           active-text="是"
					           inactive-text="否"></el-switch>
					<el-button v-if="editColPopup.edit.editable"
					           @click="setEdit"
					           style="margin-left: 20px;">设置编辑</el-button>
				</el-form-item>
				<el-form-item label="添加操作按钮" v-if="isOperate(editColPopup.edit)"
				              class="toolbars-label">
					<btn-bar :toolbars="editColPopup.edit.btns"
					         @add-btn="addBtn"
					         @go-left="goLeft"
					         @go-right="goRight"
					         @edit-btn="editBtn"
					         @del-btn="deleteBtn"></btn-bar>
				</el-form-item>
				<el-form-item label="设置枚举" v-if="isEnum(editColPopup.edit)">
					<div v-if="editColPopup.edit.enumId && editColPopup.edit.enumId !== -1">
						<el-tag @close="delCurEnum"
						        closable>enum: {{editColPopup.edit.enumId}}</el-tag>
					</div>
					<div v-else>
						<el-button @click="selectCodePopup">选择预设</el-button>
						<el-button @click="editCodePopup('enum', editColPopup.edit)">自定义</el-button>
					</div>
				</el-form-item>
				<el-form-item label="设置转化" v-if="isFormatter(editColPopup.edit)">
					<div v-if="editColPopup.edit.formatterId && editColPopup.edit.formatterId !== -1">
						<el-tag @click="delCurFormatter"
						        closable>formatter: {{editColPopup.edit.formatterId}}</el-tag>
					</div>
					<div v-else>
						<el-button @click="selectCodePopup">选择预设</el-button>
						<el-button @click="editCodePopup('formatter', editColPopup.edit)">自定义</el-button>
					</div>
				</el-form-item>
				<el-form-item label="保留小数" v-if="isNumber(editColPopup.edit)">
					保留
					<el-input v-model="editColPopup.edit.toFixed"
					          type="number"
					          style="width: 80px;"></el-input> 位小数
				</el-form-item>
				<template v-if="isDate(editColPopup.edit)">
					<el-form-item label="设置时间格式">
						<el-input v-model="editColPopup.dateFormat"></el-input>
					</el-form-item>
					<el-form-item label="绑定字段">
						<el-select v-model="editColPopup.edit.bind"
						           clearable
						           placeholder="请选择绑定字段">
							<el-option v-for="col in canBindDateCol"
							           :key="col.prop"
							           :label="col.label"
							           :value="col.prop"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="连结显示">
						<el-switch v-model="editColPopup.edit.link"
						           inline-prompt
						           active-text="是"
						           inactive-text="否"></el-switch>
						<div>连结显示会将绑定的字段设置为隐藏</div>
					</el-form-item>
				</template>
			</el-form>
			<template #footer>
			    <span class="dialog-footer">
					<el-button size="large" @click="cancelEditCol">取消</el-button>
					<el-button size="large" @click="saveEditCol" type="primary">确定</el-button>
		        </span>
			</template>
		</el-dialog>

		<el-dialog title="设置编辑选项"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="setEditPopup.show">
			<el-form label-width="100px"
			         label-position="left"
			         size="large">
				<el-form-item label="编辑接口">
					<el-input v-model="editColPopup.edit.urlPath"
					          placeholder="请输入编辑的提交接口"></el-input>
				</el-form-item>
				<el-form-item label="接口类型">
					<el-radio v-for="method in supportedMethods"
					          :label="method"
					          v-model="editColPopup.edit.method">{{method}}</el-radio>
				</el-form-item>
				<el-form-item label="传递字段">
					<div class="input-inline"
					     v-for="item in formItemOptions">
						<el-checkbox v-model="item[0].checked">{{item[0].prop}}</el-checkbox>
						<el-input placeholder="请输入别名"
						          v-model="item[0].alias"></el-input>
					</div>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" @click="cancelSetEdit">取消</el-button>
					<el-button size="large" @click="saveSetEdit" type="primary">确定</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog :title="`设置操作按钮 ${editBtnPopup.edit.title || ''}`"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="editBtnPopup.show">
			<el-form label-width="80px"
			         label-position="left"
			         size="large"
			         :model="editBtnPopup.edit">
				<el-form-item label="名称">
					<el-input v-model="editBtnPopup.edit.title"
					          placeholder="请输入按钮名称"></el-input>
				</el-form-item>
				<el-form-item label="显示条件">
					<div v-if="editBtnPopup.edit.displayList">
						<el-tag closable
						        @close="resetDisplay">{{displayStr}}</el-tag>
					</div>
					<div v-else>
						<el-button @click="setDisplay">设置显示条件</el-button>
						<el-button @click="editCodePopup('display', editBtnPopup.edit, false)">自定义</el-button>
					</div>
				</el-form-item>
				<el-form-item label="前置条件"
				              v-if="editBtnPopup.needSelect && multiple">
					需要选择数据
					<el-switch v-model="editBtnPopup.edit.select"
					           inline-prompt
					           active-text="是"
					           inactive-text="否"></el-switch>
				</el-form-item>
<!--				&lt;!&ndash; 当编辑全局按钮时要有搜索条 &ndash;&gt;-->
<!--				<el-form-item label="显示条件" v-if="!editBtnPopup.needRowData || hasSearchBar">-->
				<el-form-item label="数据选择"
				              v-if="editBtnPopup.edit.select">
					多选
					<el-switch v-model="editBtnPopup.edit.multiple"
					           inline-prompt
					           active-text="是"
					           inactive-text="否"></el-switch>
				</el-form-item>
				<el-form-item label="操作类型">
					<el-radio v-model="editBtnPopup.edit.type"
					          v-for="type in btnTypes"
					          :label="type.type">{{type.text}}</el-radio>
				</el-form-item>
				<template v-if="editBtnPopup.edit.type===1">
					<el-form-item label="操作接口">
						<el-input placeholder="请输入操作接口"
						          v-model="editBtnPopup.edit.urlPath"></el-input>
					</el-form-item>
					<el-form-item label="接口类型">
						<el-radio v-for="method in supportedMethods"
						          :label="method"
						          v-model="editBtnPopup.edit.method">{{method}}</el-radio>
					</el-form-item>
					<el-form-item label="确认">
						操作前确认
						<el-switch v-model="editBtnPopup.edit.confirm"
						           inline-prompt
						           active-text="是"
						           inactive-text="否"></el-switch>
					</el-form-item>
					<template v-if="editBtnPopup.edit.confirm">
						<el-form-item label="确认文案">
							<el-input placeholder="请输入确认文案"
							          v-model="editBtnPopup.edit.confirmDesc"></el-input>
						</el-form-item>
						<el-form-item label="确认按钮">
							<el-input placeholder="请输入确认按钮文案"
							          v-model="editBtnPopup.edit.confirmBtnDesc"></el-input>
						</el-form-item>
					</template>
				</template>
				<template v-else-if="editBtnPopup.edit.type===2">
					<el-form-item label="弹窗标题">
						<el-input placeholder="请输入弹窗标题"
						          v-model="editBtnPopup.edit.popupTitle"></el-input>
					</el-form-item>
					<el-form-item label="提交接口">
						<el-input placeholder="请输入提交接口"
						          v-model="editBtnPopup.edit.urlPath"></el-input>
					</el-form-item>
					<el-form-item label="接口类型">
						<el-radio v-for="method in supportedMethods"
						          :label="method"
						          v-model="editBtnPopup.edit.method">{{method}}</el-radio>
					</el-form-item>
					<el-form-item label="确认按钮">
						<el-input placeholder="请输入确认按钮文案"
						          v-model="editBtnPopup.edit.confirmBtnDesc"></el-input>
					</el-form-item>
				</template>
				<template v-else-if="editBtnPopup.edit.type===3">
					<el-form-item label="页面地址">
						<el-input placeholder="请输入目标页路径"
						          v-model="editBtnPopup.edit.urlPath"></el-input>
					</el-form-item>
					<el-form-item label="新窗口">
						打开新窗口
						<el-switch v-model="editBtnPopup.edit.open"
						           inline-prompt
						           active-text="是"
						           inactive-text="否"></el-switch>
					</el-form-item>
					<el-form-item label="确认">
						操作前确认
						<el-switch v-model="editBtnPopup.edit.confirm"
						           inline-prompt
						           active-text="是"
						           inactive-text="否"></el-switch>
					</el-form-item>
					<template v-if="editBtnPopup.edit.confirm">
						<el-form-item label="确认文案">
							<el-input placeholder="请输入确认文案"
							          v-model="editBtnPopup.edit.confirmDesc"></el-input>
						</el-form-item>
						<el-form-item label="确认按钮">
							<el-input placeholder="请输入确认按钮文案"
							          v-model="editBtnPopup.edit.confirmBtnDesc"></el-input>
						</el-form-item>
					</template>
				</template>
				<template v-else-if="editBtnPopup.edit.type===4">

				</template>
				<template v-else-if="editBtnPopup.edit.type===5">
					<el-form-item label="文件路径">
						<el-input placeholder="请输入下载文件路径"
						          v-model="editBtnPopup.edit.urlPath"></el-input>
					</el-form-item>
				</template>
				<el-form-item label="选择字段">
					<el-button @click="chooseParams">选择传递参数</el-button>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" @click="cancelEditBtn">取消</el-button>
					<el-button size="large" @click="saveEditBtn" type="primary">确定</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog title="自定义代码"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="codeEditPopup.show">
			<el-form label-width="80px"
			         label-position="left"
			         size="large">
				<el-form-item label="可用参数" v-if="codeEditPopup.type === 1">
					<div v-for="param in codeEditPopup.params" style="width: 100%;">
						{{param.desc}}
						<el-tag>{{param.name}}</el-tag>
						<div v-if="param.subProps && param.subProps.length"
						     style="margin-left: 20px;">
							可用字段
						</div>
						<el-tag style="margin-left: 20px;"
						        v-for="prop in param.subProps">{{param.name}}.{{prop.name}}</el-tag>
					</div>
				</el-form-item>

				<el-form-item label="说明" v-if="codeEditPopup.type === 0">
					<div>请输入字面量数组或
						<el-tag>JSON</el-tag></div>
				</el-form-item>
				<el-form-item label="说明" v-else-if="codeEditPopup.type === 1 && codeEditPopup.returnType">
					<div>返回值必须为 <el-tag>{{codeEditPopup.returnType}}</el-tag> 类型</div>
				</el-form-item>

				<el-form-item label="代码" v-if="codeEditPopup.show">
					<code-editor v-model="codeEditPopup.code"></code-editor>
				</el-form-item>
				<el-form-item label="描述"
				              v-if="codeEditPopup.canSave">
					<el-input v-model="codeEditPopup.desc"
					          type="textarea"
					          resize="none"
					          placeholder="保存为预设时，描述必填"
					          :rows="4"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" @click="cancelEditCode">取消</el-button>
					<el-button size="large" v-if="codeEditPopup.canSave"
					           @click="saveEditCodeGlobal">保存为预设</el-button>
					<el-button size="large" @click="saveEditCode" type="primary">保存</el-button>
				</span>
			</template>
		</el-dialog>

<!--
		<el-dialog title="自定义代码"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="codeEditPopup.show">
			<el-form label-width="80px"
			         label-position="left"
			         size="large">
				<el-form-item label="说明"
				              v-if="isEnum(codeEditPopup.currEdit)">
					<div>请输入字面量数组或
						<el-tag>JSON</el-tag></div>
				</el-form-item>
				&lt;!&ndash; 判断中加入 codeEditPopup.show 来促使 code-editor 在未显示时不要响应代码改变 &ndash;&gt;
				<el-form-item label="代码" v-if="codeEditPopup.show && isEnum(codeEditPopup.currEdit)">
					<code-editor v-model="codeEditPopup.currEdit.enumCode"></code-editor>
				</el-form-item>
-->

<!--
				&lt;!&ndash; 编辑数据表格行内操作按钮 &ndash;&gt;
				<el-form-item label="可用参数"
				              v-if="isFormatter(codeEditPopup.currEdit) || (isDisplay() && editBtnPopup.needRowData)">
					<div>当前字段值
						<el-tag>v</el-tag>
						<span v-if="!codeEditPopup.currEdit.prop">（当前未选择字段）</span>
					</div>
					<div>行数据
						<el-tag>r</el-tag>
					</div>
					<div style="margin-left: 20px;">行内可用字段</div>
					<el-tag style="margin-left: 20px;"
					        v-for="col in originalCols">r.{{col.prop}}</el-tag>
					<div>行号
						<el-tag>i</el-tag>
					</div>
					<div>整个表数据
						<el-tag>data</el-tag>
					</div>
				</el-form-item>
				<el-form-item label="代码" v-if="codeEditPopup.show && isFormatter(codeEditPopup.currEdit)">
					<code-editor v-model="codeEditPopup.currEdit.formatterCode"></code-editor>
				</el-form-item>
-->

<!--
				&lt;!&ndash; 编辑数据表格外按钮 &ndash;&gt;
				<el-form-item label="可用参数" v-if="isDisplay() && !editBtnPopup.needRowData">
					<div>当前搜索条件
						<el-tag>search</el-tag>
					</div>
					<div style="margin-left: 20px;">搜索条件可用字段</div>
					<el-tag style="margin-left: 20px;"
					        v-for="item in searchItems">search.{{item[0].alias || item[0].prop}}</el-tag>
					<div>路径参数
						<el-tag>params</el-tag>
					</div>
					<div style="margin-left: 20px;">路径参数可用字段</div>
					<el-tag style="margin-left: 20px;">params.{{fetch.page}}</el-tag>
					<el-tag style="margin-left: 20px;">params.{{fetch.size}}</el-tag>
					<el-tag style="margin-left: 20px;"
					        v-for="item in extQuery">params.{{item.name}}</el-tag>
					<div>路由参数
						<el-tag>hash</el-tag>
					</div>
				</el-form-item>
				<el-form-item label="说明"
				              v-if="isDisplay()">
					<div>返回值必须为 <el-tag>boolean</el-tag> 类型</div>
				</el-form-item>
				<el-form-item label="代码" v-if="codeEditPopup.show && isDisplay()">
					<code-editor v-model="codeEditPopup.currEdit.displayCode"></code-editor>
				</el-form-item>
				<el-form-item label="描述"
				              v-if="codeEditPopup.canSave">
					<el-input v-model="codeEditPopup.desc"
					          type="textarea"
					          resize="none"
					          placeholder="保存为预设时，描述必填"
					          :row="4"></el-input>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" @click="cancelEditCode">取消</el-button>
					<el-button size="large" v-if="codeEditPopup.canSave"
					           @click="saveEditCodeGlobal">保存为预设</el-button>
					<el-button size="large" @click="saveEditCode" type="primary">保存</el-button>
				</span>
			</template>
		</el-dialog>
-->

		<select-table v-bind="codeSelectPopup"
		              @select="selectCode"
		              @cancel-select="cancelSelectCode"
		              @change-page="changeCodePage"></select-table>

		<el-dialog title="设置按钮显示条件"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="setDisplayPopup.show">
			<el-form label-width="100px"
			         label-position="left"
			         size="large">
				<el-form-item label="说明">
					<div>匹配值会进行类型转换，如果期望为字符串可添加引号</div>
				</el-form-item>
				<el-form-item label="字段值匹配">
					<div class="input-inline"
					     v-if="editBtnPopup.needRowData"
					     v-for="item in formItemOptions">
						<span v-text="item[0].prop"></span>
						<div style="float:right;">
							<el-input placeholder="请输入匹配值"
							          v-model="item[0].match"></el-input>
						</div>
					</div>
					<div class="input-inline"
					     v-else
					     v-for="item in searchItems">
						<span v-text="item[0].prop"></span>
						<div style="float:right;">
							<el-input placeholder="请输入匹配值"
							          v-model="item[0].match"></el-input>
						</div>
					</div>
				</el-form-item>
				<el-form-item label="条件关系">
					<el-radio :label="0"
					          v-model="setDisplayPopup.type">并关系</el-radio>
					<el-radio :label="1"
					          v-model="setDisplayPopup.type">或关系</el-radio>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" @click="cancelSetDisplay">取消</el-button>
					<el-button size="large" @click="saveSetDisplay" type="primary">确定</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog title="选择表单字段"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="chooseParamsPopup.show">
			<el-form label-width="80px"
			         label-position="left"
			         size="large"
			         ref="chooseParamsForm">
				<el-form-item label="传递字段">
					<div class="input-inline"
					     v-for="item in formItemOptions">
						<el-checkbox v-model="item[0].checked">{{item[0].prop}}</el-checkbox>
						<div style="float:right;">
							<el-input placeholder="请输入变量别名"
							          v-model="item[0].alias"></el-input>
							<el-button @click="editParam(item)"
							           style="margin-left: 10px;"
							           type="primary"
							           size="small" circle>
								<icons name="tools"></icons>
							</el-button>
						</div>
					</div>
				</el-form-item>
				<param-list :list="extQuery"
				            @add-param="addParam"
				            @del-param="deleteItem"></param-list>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" @click="cancelChooseParams">取消</el-button>
					<el-button size="large" @click="saveChooseParams" type="primary">确定</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog :title="`设置表单字段 ${editFormItemPopup.show ? editFormItemPopup.edit[0].prop || '' :''}`"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="editFormItemPopup.show">
			<el-form label-width="80px"
			         label-position="left"
			         size="large">
				<el-form-item label="字段文案">
					<el-input placeholder="请输入字段文案"
					          v-model="editFormItemPopup.edit[0].label"></el-input>
				</el-form-item>
				<el-form-item label="别名">
					<el-input placeholder="请输入别名"
					          v-model="editFormItemPopup.edit[0].alias"></el-input>
				</el-form-item>
				<el-form-item label="隐藏域">
					<el-switch v-model="editFormItemPopup.edit[0].hidden"
					           inline-prompt
					           active-text="是"
					           inactive-text="否"></el-switch>
				</el-form-item>
				<el-form-item label="显示条件">

				</el-form-item>
				<el-form-item label="默认值">
					<el-switch v-model="editFormItemPopup.edit[0].inject"
					           :disabled="editBtnPopup.edit.multiple"
					           inline-prompt
					           active-text="是"
					           inactive-text="否"></el-switch>
					<div style="margin-left: 10px;">注入默认值</div>
				</el-form-item>
				<el-form-item label="必填项">
					<el-switch v-model="editFormItemPopup.edit[0].required"
					           inline-prompt
					           active-text="是"
					           inactive-text="否"></el-switch>
				</el-form-item>
				<el-form-item label="验证">
<!-- todo -->
				</el-form-item>
				<template v-if="isEnum(editFormItemPopup.edit[1])">
					<el-form-item label="形式">
						<el-radio :label="1"
						          v-model="editFormItemPopup.edit[0].enumType">选择框</el-radio>
						<el-radio :label="2"
						          v-model="editFormItemPopup.edit[0].enumType">下拉框</el-radio>
					</el-form-item>
					<el-form-item label="多选">
						<el-switch v-model="editFormItemPopup.edit[0].enumMultiple"
						           inline-prompt
						           active-text="是"
						           inactive-text="否"
						           @change="resetMultipleValue"></el-switch>
					</el-form-item>
				</template>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" @click="cancelEditFormItem">取消</el-button>
					<el-button size="large" @click="saveEditFormItem" type="primary">确定</el-button>
				</span>
			</template>
		</el-dialog>

		<el-dialog title="设置表格"
		           :close-on-click-modal="false"
		           :close-on-press-escape="false"
		           :show-close="false"
		           :model-value="setTablePopup.show">
			<el-form label-width="80px"
			         label-position="left"
			         size="large">
				<el-form-item label="多选">
					<el-switch v-model="multiple"
					           inline-prompt
					           active-text="有"
					           inactive-text="无"
					           @change="toggleSelection"></el-switch>
				</el-form-item>
				<template v-if="multiple">
					<el-form-item label="多选设置"></el-form-item>
					<el-form-item label="固定位置">
						<el-checkbox-group v-model="multipleFixed" :max="1">
							<el-checkbox v-for="item in ['left', 'right']"
							             :key="item"
							             :label="item"></el-checkbox>
<!--							<el-checkbox key="left" label="left">居左</el-checkbox>-->
<!--							<el-checkbox key="right" label="right">居右</el-checkbox>-->
						</el-checkbox-group>
					</el-form-item>
				</template>
				<el-form-item label="展开">
					<el-switch v-model="expand"
					           inline-prompt
					           active-text="有"
					           inactive-text="无"
					           @change="toggleExpand"></el-switch>
				</el-form-item>
				<template v-if="expand">
					<el-form-item label="展开设置"></el-form-item>

				</template>
				<el-form-item label="统计行">
					<el-switch v-model="countRow"
					           inline-prompt
					           active-text="有"
					           inactive-text="无"></el-switch>
				</el-form-item>
			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button size="large" @click="saveSetTable" type="primary">确定</el-button>
				</span>
			</template>
		</el-dialog>
	</el-col>

	<el-col v-else-if="step===2"
	        :span="24">
		<el-form label-width="80px" :model="page" :rules="rules">
			<el-form-item label="所属项目" prop="project">
				<el-select v-model="page.project"
				           placeholder="请选择所属项目">
					<el-option v-for="project in projectList"
					           :key="project.name"
					           :label="project.title"
					           :value="project.name">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="菜单名称" prop="menu">
				<el-input v-model="page.menu"
				          placeholder="请输入菜单名称"></el-input>
			</el-form-item>
			<el-form-item label="页面路径" prop="path">
				<el-input v-model="page.path"
				          placeholder="请输入页面路径"></el-input>
			</el-form-item>
			<el-form-item label="页面描述" prop="description">
				<el-input v-model="page.description"
				          type="textarea"
				          resize="none"
				          placeholder="请输入页面功能描述"
				          :rows="4">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="prevStep">上一步</el-button>
				<el-button @click="submit" type="primary">保存</el-button>
			</el-form-item>
		</el-form>
	</el-col>
</el-row>
</template>

<script>
import {view, COL_TYPE, CODE_TYPE, imgPath} from '../../../mgcc';
import btnBar                      from '../../components/btnBar/index.vue';
import paramList                   from '../../components/paramList/index.vue';
import codeEditor                  from '../../components/codeEditor/index.vue';
import selectTable                 from '../../components/selectTable/index.vue';

const SUPPORTED_METHODS = [
		'GET'
		, 'POST'
	]
	, DATE_FORMAT = 'YYYY-MM-DD hh:mm:ss'
	, BTN_TYPE = [{
		type: 1
		, text: '接口'
	}, {
		type: 2
		, text: '弹窗表单'
	}, {
		type: 3
		, text: '页面跳转'
	}, {
		type: 4
		, text: '导入'
	}, {
		type: 5
		, text: '导出'
	}]
	;
let { virtual } = view
	, required = true
	, trigger = 'blur'
	;

/**
 * 各个弹窗之间的关系
 * todo 考虑重构
 * 
    编辑列弹窗
  ┌────────────────┐     ┌────────────────┐
  │                │     │                │
  │  editColPopup  ├─────►  setEditPopup  │ 设置编辑选项
  │                │     │                │
  └─┬─────────────┬┘     └────────────────┘
    │             │
    │             │      ┌───────────────────┐
    │             │      │                   │
    │             └────┬─►  codeSelectPopup  │ 选择枚举或转化函数
    │                  │ │                   │
    │                  │ └───────────────────┘
    │                  │自定义枚举数据
    │                  └─────────┐
    │                            │
    │                    ┌───────▼─────────┐
    │                    │                 │
    │                ┌───►  codeEditPopup  │ 自定义代码弹窗
    │                │   │                 │
    │                │   └─────────────────┘
    │                │自定义显示条件函数
  ┌─▼──────────────┐ │   ┌───────────────────┐
  │                │ │   │                   │
  │  editBtnPopup  ├─┴───►  setDisplayPopup  │ 设置显示条件
  │                │     │                   │
  └───────────────┬┘     └───────────────────┘
    编辑按钮弹窗    │
                  │      ┌─────────────────────┐
                  │      │                     │
                  └──────►  chooseParamsPopup  │ 选择参数
                         │                     │
                         └──────────┬──────────┘
                                    │
  ┌─────────────────────┐           │
  │                     │           │
  │  editFormItemPopup  ◄───────────┘
  │                     │
  └─────────────────────┘
    编辑参数
 * */

export default {
	name: 'beNew'
	, components: {
		btnBar
		, paramList
		, codeEditor
		, selectTable
	}
	, mixins: [virtual]
	, data(){
		return {
			mode: 'new' // new: 新建模式 edit: 编辑模式

			, step: 0
			, steps: ['第一步', '第二步', '第三步']

			, dataTemplate: ''

			, data: []
			, count: 0

			, rules: {
				main: [{
					required
					, message: '请输入核心接口'
					, trigger
				}]
				, page: [{
					required
					, message: '请输入页码变量名称'
					, trigger
				}]
				, start: [{
					required
					, message: '请输入起始页码'
					, trigger
				}]
				, size: [{
					required
					, message: '请输入每页数量变量名称'
					, trigger
				}]
				, pageSize: [{
					required
					, message: '请输入每页数量'
					, trigger
				}]
				, project: [{
					required
					, message: '请选择页面所属项目'
					, trigger: 'change'
				}]
				, menu: [{
					required
					, message: '请输入页面菜单名称'
					, trigger
				}]
				, path: [{
					required
					, message: '请输入页面路径'
					, trigger
				}]
			}

			, fetch: {
				main: ''
				, mainPath: ''
				, mainMethod: 'GET'
				, count: ''
				, countPath: ''
				, countMethod: 'GET'
				, page: 'page'
				, start: 1
				, size: 'size'
				, pageSize: 20
				, extQuery: []
			}
			, supportedMethods: SUPPORTED_METHODS
			, btnTypes: BTN_TYPE

			, extQuery: []

			, cols: []
			, originalCols: []  // 原始数据列，所有数据列
			, notUseProp: []    // 未使用字段
			, multiple: false
			, multipleFixed: ''

			, expand: false
			, countRow: false
			, colType: COL_TYPE

			, setTablePopup: {
				show: false
				, backup: null
			}

			// 编辑列弹窗
			, editColPopup: {
				show: false
				, backup: null
				, edit: {
					btns: []
				}
				, position: ''
				, dateFormat: DATE_FORMAT
			}

			// 选择代码弹窗
			, codeSelectPopup: {
				title: ''
				, show: false
				, data: []
				, keys: [{
					label: 'id'
					, prop: 'id'
				}, {
					label: '描述'
					, prop: 'description'
				}]
				, page: 1
				, size: 20
				, count: 0
			}
			, codePopupSet: {
				titleOptions: [
					'选择预设枚举'
					, '选择预设转化函数'
				]
				, type: 0
			}
			// 自定义代码弹窗
			, codeEditPopup: {
				show: false
				, mode: ''
				, type: 0
				, code: ''
				, params: []
				, returnType: ''
				, currEdit: null
				, canSave: true // 是否可以保存到全局
				, desc: ''
			}
			// 设置编辑选项弹窗
			, setEditPopup: {
				show: false
			}

			, toolbars: []
			// 按钮编辑弹窗
			, editBtnPopup: {
				show: false
				, backup: null
				, edit: {}
				, list: []
				, needSelect: true  // 是否需要选择数据行，编辑列时设置为 false
				, needRowData: false // 是否需要行数据，编辑列时设置为 true
			}
			// 按钮显示条件
			, setDisplayPopup: {
				show: false
				, type: 1
			}

			// 表单可用字段
			, formItemOptions: []
			// 选择参数
			, chooseParamsPopup: {
				show: false
			}
			// 编辑表单字段
			, editFormItemPopup: {
				show: false
				, backup: null
				, edit: []
				, form: null
			}

			, searchItems: []
			, originalSearchItems: []
			, hasSearchBar: false

			, page: {
				project: ''
				, menu: ''
				, path: ''
				, description: ''
			}
			, projectList: []
		};
	}
	, methods: {
		init(){
			// const formData = [{
			// 	key: 'name'
			// 	, value: ''
			// 	, required: true
			// 	, label: '页面名称'
			// 	, placeholder: '请输入页面名称'
			// 	, rules: [{
			// 		required: true
			// 		, message: '请输入页面名称'
			// 		, trigger: 'blur'
			// 	}]
			// }, {
			// 	key: 'path'
			// 	, value: ''
			// 	, required: true
			// 	, label: '页面路径'
			// 	, placeholder: '青输入页面路径'
			// }];

			let { id
				, mode } = this.$hashParams()
				;

			if( id ){
				this.mode = mode || 'edit';
				this.id = id;

				this.$midway.pageGet({
					id
				}).then(({data})=>{
					let { config } = data
						;

					try{
						config = JSON.parse( config )
					}
					catch(e){
						config = {};
					}

					let { main, count } = config.fetch
						, mainPath = this.assemblyUrl( main )
						, countPath = this.assemblyUrl( count )
						;

					Promise.all([
						this.fetchEnumData( config.cols )
						, this.fetchFormatterData( config.cols )
					]).then(()=>{
						config.cols.forEach((col)=>{
							col.url && (col.urlPath = this.assemblyUrl( col.url ));

							if( this.isFormatter(col) ){
								this.handleFormatter( col );
							}
							else if( this.isEnum(col) ){
								this.handleEnum( col );
							}
							else if( this.isOperate(col) ){
								col.btns.forEach((btn)=>{
									if( btn.url ){
										if( btn.type !== 3 ){
											btn.urlPath = this.assemblyUrl( btn.url )
										}
										else{
											btn.urlPath = btn.url.url;
										}
									}

									this.handleRowBtnDisplay( btn );
								});
							}
							else if( this.isSpecialCol(col) ){
								col.key = col.type;
							}

							if( col.hidden ){
								col.width = 200;
								col.align = 'center';
							}
						});
						config.toolbars.forEach((btn)=>{
							if( btn.url ){
								if( btn.type !== 3 ){
									btn.urlPath = this.assemblyUrl( btn.url )
								}
								else{
									btn.urlPath = btn.url.url;
								}
							}

							this.handleBtnDisplay( btn );
						});

						this.fetch = {
							...config.fetch
							, mainPath
							, countPath
						};
						this.cols = config.cols;
						this.toolbars = config.toolbars;
						this.searchItems = (config.searchItems || []).map((item)=>{
							let col = config.cols.find((col)=>{
									return col.prop === item.prop;
								})
								;

							// 临时列
							if( !col ){
								col = {};
							}

							return [item, col];
						});

						delete data.config;

						if( this.mode === 'edit' ){
							this.page = data;
						}

						this.hasSearchBar = !!this.searchItems.length;
						this.multiple = this.cols.some((col)=>{
							return this.isSelection( col );
						});
						this.expand = this.cols.some((col)=>{
							return this.isExpand( col );
						});
					});
				});
			}

			this.$midway.codeGet({
				id: 1
			}).then(({data})=>{
				this.projectList = Object.entries( JSON.parse(data.code) ).map(([name, title])=>{
					return {
						name
						, title
					};
				});
			});
		}

		, path(src){
			return imgPath( src );
		}

		, showPrevStep(){
			return this.step !== 0;
		}
		, showNextStep(){
			return this.step !== this.steps.length -1;
		}
		, prevStep(){
			this.step--;
		}
		, nextStep(){
			this.step++;
		}

		// 左右移动通用方法
		, goLeft(item, index, list){
			if( index === 0 ){
				return ;
			}

			list.splice(index, 1);

			list.splice(index -1, 0, item);
		}
		, goRight(item, index, list){
			if( index === list.length -1 ){
				return ;
			}

			list.splice(index, 1);

			list.splice(index +1, 0, item);
		}
		// 删除列表项通用方法
		, deleteItem(item, index, list){
			list.splice(index, 1);
		}

		// 添加参数
		, addParam(list){
			list.push({
				name: ''
				, value: ''
				, desc: ''
			});
		}

		// 请求数据
		, goFetch(){
			let d
				;

			if( this.dataTemplate ){
				try{
					d = eval(`(${this.dataTemplate})`);

					if( !Array.isArray(d) ){
						if( typeof d === 'object' ){
							d = [d];
						}
						else{
							this.$message({
								message: '输入的数据结构模板不符合格式'
								, center: true
							});
						}
					}

					if( Array.isArray(d) ){
						this.data = d;
						this.handleCols( this.data );

						this.step++;

						return ;
					}
				}
				catch(e){
					this.$message({
						message: '输入的数据结构模板不符合格式'
						, center: true
					});
				}
			}

			if( !this.fetch.mainPath ){
				this.$alert('必须填写查询接口，才能继续进行', {
					type: 'error'
				});

				return ;
			}
			
			this.fetch.main = this.handleUrlResult( this.fetch.mainPath );
			this.fetch.count = this.handleUrlResult( this.fetch.countPath );

			this.initFetchParams();
			
			this.fetchData().then(()=>{
				this.handleCols( this.data );

				this.step++;
			});
			this.resetSearchForm(true);
		}
		, handleCols(data){
			if( data.length ){
				let keys = data.reduce((keys, item)=>{
						return Object.keys( item ).reduce((keys, key)=>{
							keys.add( key );

							return keys;
						}, keys);
					}, new Set())
					;

				this.originalCols = Array.from( keys ).map((key)=>{
					let col = this.cols.find((col)=>{
							return col.prop === key;
						})
						;

					if( col ){
						col.key = col.key || col.prop || col.type;

						return col;
					}

					return {
						label: ''
						, width: 200
						, key
						, prop: key
						, type: 'text'
						, align: 'center'
						, sortable: false
						, editable: false
						, url: ''
						, btns: []
					};
				});

				if( this.mode === 'new' ){
					this.cols = [...this.originalCols];
				}
			}
			else{
				if( this.mode !== 'new' ){
					this.originalCols = [...this.cols];
				}
			}
		}

		, setTable(){
			this.setTablePopup.show = true;
		}
		// , cancelSetTable(){
		// 	this.setTablePopup.show = false;
		// }
		, saveSetTable(){
			this.setTablePopup.show = false;
		}

		/**
		 * 列设置
		 * */
		// 是否显示多选 checkbox
		, toggleSelection(val){
			let selectionIndex
				, expandIndex
				;

			if( val ){
				expandIndex = this.cols.findIndex((col)=>{
					return this.isExpand( col );
				}) +1;

				this.cols.splice(expandIndex, 0, {
					type: 'selection'
					, width: 55
					, align: 'center'
					, key: 'selection'
					, fixed: this.multipleFixed || undefined
				});
			}
			else{
				selectionIndex = this.cols.findIndex((col)=>{
					return this.isSelection( col );
				});

				this.cols.splice(selectionIndex, 1);
			}
		}
		// 是否显示展开
		, toggleExpand(val){
			if( val ){
				this.cols.unshift({
					type: 'expand'
					, width: 55
					, align: 'center'
					, key: 'expand'
				});
			}
			else{
				this.cols.shift();
			}
		}
		// 设置展开列
		, editExpandCol(col){

		}
		// 改变列的类型，引发判断是否可以继续排序、编辑，清空操作按钮
		, changeColType(targetCol, type){
			targetCol.sortable = targetCol.sortable && this.isSortable({type});
			targetCol.editable = targetCol.editable && this.isEditable({type});

			if( this.isOperate({type}) ){
				targetCol.btns = [];
			}
		}
		// 列向左右移动
		, colGoLeft(index, col){
			if( index === 0 ){
				return ;
			}

			if( this.isSpecialCol(this.cols[index -1]) ){
				return ;
			}

			if( index !== -1 ){
				this.cols.splice(index, 1);

				this.$nextTick(()=>{
					this.cols.splice(index -1, 0, col);
				});
			}
		}
		, colGoRight(index, col){
			if( index === this.cols.length -1 ){
				return ;
			}

			if( index !== -1 ){
				this.cols.splice(index, 1);

				this.$nextTick(()=>{
					this.cols.splice(index +1, 0, col);
				});
			}
		}
		// 添加列
		, addCol(){
			this.editColPopup.edit = {
				align: 'center'
				, newWidth: 200
				, btns: []
				, hidden: false
			};

			this.editBtnPopup.needSelect = false;
			this.editBtnPopup.needRowData = true;

			this.resetFormItemOptions();

			this.notUseProp = this.originalCols.reduce((rs, col)=>{
				let has = this.cols.some((c)=>{
						return c.prop === col.prop
					})
					;

				if( !has ){
					rs.push( col.prop );
				}

				return rs;
			}, []);

			this.editColPopup.show = true;
		}
		// 编辑列
		, editCol(col){
			// 备份当前列的设置参数
			this.editColPopup.backup = col;

			this.editBtnPopup.needSelect = false;
			this.editBtnPopup.needRowData = true;

			this.resetFormItemOptions(col.params, col);

			col.newWidth = col.width;

			this.editColPopup.edit = {
				hidden: false
				, ...col
			};

			if( this.isDate(col) ){
				this.editColPopup.dateFormat = col.dateFormat || this.editColPopup.dateFormat;
			}

			this.editColPopup.show = true;
		}
		// 保存列修改
		, saveEditCol(){
			let { edit
				, backup
				, dateFormat } = this.editColPopup
				, index = 0
				, target
				;

			edit.width = +edit.newWidth;

			if( this.isEdit(edit) ){
				edit.params = this.handleCheckedOptions();
			}

			if( this.isDate(edit) ){
				edit.dateFormat = dateFormat;

				if( edit.bind ){
					let index = this.cols.findIndex(({prop})=>{
							return prop === edit.bind;
						})
						, tempCol = this.cols[index]
						;

					tempCol.dateFormat = dateFormat;
					tempCol.hidden = edit.link;
				}
			}

			if( backup === null ){
				if( !edit.label && !edit.prop ){
					return '';
				}

				if( this.isSelection(this.cols[0]) ){
					index = 1;
				}

				edit.key = '';

				// 新加列 替换原始数据
				if( edit.prop ){
					edit.key = edit.prop;

					let target = this.originalCols.find((col)=>{
							return col.prop === edit.prop;
						})
						;

					if( target ){
						Object.assign(target, edit);
					}

					edit = target;
				}

				this.cols.splice(index, 0, edit);
				target = edit;
			}
			else{
				Object.assign(backup, edit);
				index = this.cols.indexOf( backup );
				target = backup;
			}

			if( edit.hidden ){
				this.editColPopup.position = this.cols.length;
			}

			// todo 更多校验
			if( this.editColPopup.position && /\d+/.test( this.editColPopup.position ) ){
				let newPosition = parseInt( this.editColPopup.position )
					;

				if( newPosition !== index ){
					this.cols.splice(index, 1);

					this.$nextTick(()=>{
						this.cols.splice(newPosition, 0, target);
					});
				}
			}

			this.editColPopup.show = false;

			this.editColPopup.backup = null;

			this.editBtnPopup.needSelect = true;
			this.editBtnPopup.needRowData = false;

			this.editColPopup.position = '';
			this.editColPopup.dateFormat = DATE_FORMAT;
		}
		// 取消修改列设置
		, cancelEditCol(){
			this.editColPopup.show = false;

			this.editColPopup.backup = null;

			this.editBtnPopup.needSelect = true;
			this.editBtnPopup.needRowData = false;
		}
		// 删除列
		, deleteCol(col, index, cols){
			this.$confirm('该操作会删除当前列，是否继续？', '提示', {
				confirmButtonText: '确定'
				, confirmButtonClass: 'el-button--danger'
				, cancelButtonText: '取消'
				, type: 'warning'
				, center: true
			}).then(()=>{
				this.deleteItem(col, index, cols);
			}, ()=>{});
		}

		// 设置编辑
		, setEdit(){
			this.setEditPopup.show = true;
		}
		, cancelSetEdit(){
			this.setEditPopup.show = false;
		}
		, saveSetEdit(){
			this.setEditPopup.show = false;
		}

		// 枚举相关操作
		, delCurEnum(){
			this.editColPopup.edit.enumId = -1;
		}
		, selectEnum(rows){
			let [ row ] = rows
				;

			this.editColPopup.edit.enumId = row.id;
			this.editColPopup.edit.enumCode = row.code;

			if( !this.validEnumCode(this.editColPopup.edit) ){
				return ;
			}

			this.codeSelectPopup.show = false;
		}
		, validEnumCode(codeTarget){
			try{
				return this.handleEnum( codeTarget );
			}
			catch(e){
				this.$alert('输入的代码不符合格式', {
					type: 'error'
				});

				return false;
			}
		}

		// 转化函数相关操作
		, delCurFormatter(){
			this.editColPopup.edit.formatterId = -1;
		}
		, selectFormatter(rows){
			let [ row ] = rows
				;

			this.editColPopup.edit.formatterId = row.id;
			this.editColPopup.edit.formatterCode = row.code;

			if( !this.validFormatterCode() ){
				return ;
			}

			this.codeSelectPopup.show = false;
		}
		, validFormatterCode(codeTarget){
			try{
				let rs = this.handleFormatter( codeTarget )
					;

				if( !rs ){
					return rs;
				}

				let prop = this.editColPopup.edit.prop
					;

				// 试运行一下，看是否会报错
				codeTarget.formatterHandler(prop ? this.data[0][prop] : undefined, this.data[0], 0, this.data);

				return rs;
			}
			catch(e){
				this.$alert('输入的代码无法正常执行', {
					type: 'error'
				});

				return false;
			}
		}

		// 选择代码弹窗相关操作
		, selectCodePopup(){
			let type = CODE_TYPE.indexOf( this.editColPopup.edit.type )
				;

			this.codeSelectPopup.title = this.codePopupSet.titleOptions[type];
			this.changeCodePage(1, 20).then(()=>{
				this.codeSelectPopup.show = true;
			});
		}
		, cancelSelectCode(){
			this.codeSelectPopup.show = false;
		}
		, changeCodePage(page, size){
			let type = CODE_TYPE.indexOf( this.editColPopup.edit.type )
				;

			this.codeSelectPopup.page = page;
			this.codeSelectPopup.size = size;

			return Promise.all([
				this.$midway.codeList({
					type
					, page
					, size
				})
				, this.$midway.codeCount({
					type
				})
			]).then(([{data}, {data:count}])=>{
				this.codeSelectPopup.data = data;
				this.codeSelectPopup.count = count;
			});
		}
		, selectCode(rows){
			if( rows.length > 1 ){
				this.$alert('请只选择一行数据', {
					type: 'error'
				});

				return ;
			}

			let type = CODE_TYPE.indexOf( this.editColPopup.edit.type )
				;

			switch( type ){
				case 0:
					this.selectEnum( rows );
					break;
				case 1:
					this.selectFormatter( rows );
					break;
				default:
					break;
			}
		}

		// 编辑代码弹窗
		, editCodePopup(mode, currEdit, canSave=true){
			this.codeEditPopup.mode = mode;
			this.codeEditPopup.currEdit = currEdit;
			this.codeEditPopup.canSave = canSave;

			switch( mode ){
				case 'enum':
					this.codeEditPopup.type = 0;
					this.codeEditPopup.code = this.codeEditPopup.backup = currEdit.enumCode;
					this.codeEditPopup.params = [];
					break;
				case 'formatter':
					this.codeEditPopup.type = 1;
					this.codeEditPopup.code = this.codeEditPopup.backup = currEdit.formatterCode;
					this.codeEditPopup.params = [{
						name: 'v'
						, desc: '当前字段值（未选择则为空）'
					}, {
						name: 'r'
						, desc: '行数据'
						, subProps: this.originalCols.map((col)=>{
							return {
								name: col.prop
							};
						})
					}, {
						name: 'i'
						, desc: '行号'
					}, {
						name: 'data'
						, desc: '整个表数据'
					}];
					this.codeEditPopup.returnType = '';
					break;
				case 'display':
					this.codeEditPopup.type = 1;
					this.codeEditPopup.code = this.codeEditPopup.backup = currEdit.displayCode;

					if( this.editBtnPopup.needRowData ){
						this.codeEditPopup.params = [{
							name: 'v'
							, desc: '当前字段值（未选择则为空）'
						}, {
							name: 'r'
							, desc: '行数据'
							, subProps: this.originalCols.map((col)=>{
								return {
									name: col.prop
								};
							})
						}, {
							name: 'i'
							, desc: '行号'
						}, {
							name: 'data'
							, desc: '整个表数据'
						}];
					}
					else{
						this.codeEditPopup.params = [{
							name: 'search'
							, desc: '当前搜索条件'
							, subProps: this.searchItems.map(([item])=>{
								return {
									name: item.alias || item.prop
								};
							})
						}, {
							name: 'params'
							, desc: '路径参数'
							, subProps: [{
								name: this.fetch.page
							}, {
								name: this.fetch.size
							}, ...this.fetch.extQuery.map(({name})=>{
								return {
									name
								};
							})]
						}, {
							name: 'hash'
							, desc: '路由参数'
						}];
					}

					this.codeEditPopup.returnType = 'boolean';
					break;
			}

			this.codeEditPopup.show = true;
		}
		, cancelEditCode(){
			this.codeEditPopup.show = false;
		}
		, saveEditCode(){
			let temp
				,
				{ mode, code } = this.codeEditPopup
				;

			switch( mode ){
				case 'enum':
					temp = {
						type: 'enum'
						, enumCode: code
					};

					if( !this.validEnumCode(temp) ){
						return false;
					}

					break;
				case 'formatter':
					temp = {
						type: 'formatter'
						, formatterCode: code
					};

					if( !this.validFormatterCode(temp) ){
						return false;
					}

					break;
				case 'display':
					temp = {
						displayCode: code
					};

					if( !this.validDisplayCode(temp) ){
						return false;
					}

					break;
			}

			Object.assign(this.codeEditPopup.currEdit, temp);

			this.codeEditPopup.show = false;
		}
		, saveEditCodeGlobal(){
			let codeKey
				, idKey
				, type
				, rs = this.saveEditCode()
				,
				{ mode, code, desc: description } = this.codeEditPopup
				;

			if( rs === false ){
				return ;
			}

			switch( mode ){
				case 'enum':
					codeKey = 'enumCode';
					idKey = 'enumId';
					type = 0;
					break;
				case 'formatter':
					codeKey = 'formatterCode';
					idKey = 'formatterId';
					type = 1;
					break;
				// 可以添加其它
			}

			try{
				this.$midway.codeCreate.post({
					code
					, type
					, description
				}).then(({data:{id}})=>{
					this.editColPopup.edit[idKey] = id;

					this.codeEditPopup.show = false;
				});
			}
			catch(e){
				this.$alert('保存预设失败', {
					type: 'error'
				});
			}
		}

		, handleCheckedOptions(){
			return this.formItemOptions.reduce((rs, [param])=>{
				let { checked } = param
					;

				if( checked ){
					rs.push( param );
				}

				return rs;
			}, []);
		}
		, resetFormItemOptions(currParams=[], initCol){
			this.formItemOptions = this.originalCols.map((col)=>{
				let param = currParams ? currParams.find((p)=>{
						return p.prop === col.prop
					}) : null
					;

				if( param ){
					param.checked = true;

					return [param, col];
				}

				return [{
					prop: col.prop
					, label: col.label
					, checked: !!(initCol && initCol.prop === col.prop)
					, hidden: false
					, inject: false
					, alias: ''
					, required: false
				}, col];
			});
		}
		, resetExtQuery(extQuery){
			this.extQuery = extQuery ? extQuery.map((p)=>{
				return {
					...p
				};
			}) : [];
		}

		// 设置按钮显示条件
		, setDisplay(){
			this.setDisplayPopup.show = true;
		}
		, saveSetDisplay(){
			let type = this.setDisplayPopup.type
				;

			this.editBtnPopup.edit.displayList = this.formItemOptions.reduce((rs, [param])=>{
				let { prop
					, match } = param
					;

				if( match ){
					try{
						match = JSON.parse( match );
					}
					catch(e){}

					/**
					 * 或关系 displayList 为数组类型
					 * 并关系 displayList 为对象类型
					 * */
					if( type ){ // 或关系
						rs.push({
							[prop]: match
						});
					}
					else{   // 并关系
						rs[prop] = match;
					}
				}

				return rs;
			}, type ? [] : {});

			this.setDisplayPopup.show = false;
		}
		, cancelSetDisplay(){
			this.setDisplayPopup.show = false;
		}
		, isDisplay(){
			return this.codeEditPopup.mode === 'display';
		}
		, resetDisplay(){
			this.editBtnPopup.edit.displayList = null;
		}
		, validDisplayCode(edit){
			try{
				let rs
					;

				if( this.editBtnPopup.needRowData ){
					this.handleRowBtnDisplay( edit );

					// 试运行一下，看是否会报错
					rs = edit.displayHandler(this.data[0], 0, this.data);
				}
				else{
					this.handleBtnDisplay( edit );

					// 试运行一下，看是否会报错
					rs = edit.displayHandler(this.searchForm, this.$urlParams(), this.$hashParams());
				}

				if( typeof rs !== 'boolean' ){
					this.$alert('代码返回值不是 boolean 类型', {
						type: 'error'
					});

					return false;
				}

				return true;
			}
			catch(e){
				this.$alert('输入的代码无法正常执行', {
					type: 'error'
				});

				return false;
			}
		}

		// 选择参数弹窗
		, chooseParams(){
			this.chooseParamsPopup.show = true;
		}
		, saveChooseParams(){
			this.chooseParamsPopup.show = false;
		}
		, cancelChooseParams(){
			this.resetFormItemOptions( this.editBtnPopup.edit.params );

			this.chooseParamsPopup.show = false;
		}

		// 编辑
		, editParam(formItem){
			this.editFormItemPopup.backup = formItem[0];

			this.editFormItemPopup.edit = [{
				...formItem[0]
			}, formItem[1]];

			this.editFormItemPopup.show = true;
		}
		// 保存修改表单字段
		, saveEditFormItem(){
			Object.assign(this.editFormItemPopup.backup, this.editFormItemPopup.edit[0]);

			this.editFormItemPopup.form = null;

			this.editFormItemPopup.show = false;
		}
		// 取消修改表单字段
		, cancelEditFormItem(){
			this.editFormItemPopup.edit[0] = this.editFormItemPopup.backup;

			this.editFormItemPopup.form = null;

			this.editFormItemPopup.show = false;
		}

		// 添加操作按钮
		, addBtn(targetBtnList){
			this.editBtnPopup.edit = {
				select: false
			};

			this.resetExtQuery();

			this.resetFormItemOptions();

			this.editBtnPopup.list = targetBtnList;

			this.editBtnPopup.show = true;
		}
		// 编辑操作按钮
		, editBtn(btn){
			this.editBtnPopup.backup = btn;

			this.editBtnPopup.edit = {
				...btn
			};

			this.resetExtQuery( btn.extQuery );

			this.resetFormItemOptions( this.editBtnPopup.edit.params );

			this.editBtnPopup.show = true;
		}
		// 保存编辑操作按钮
		, saveEditBtn(){
			let { edit
				, backup } = this.editBtnPopup
				;

			edit.params = this.handleCheckedOptions();

			edit.extQuery = this.extQuery;

			if( this.editBtnPopup.needRowData ){
				this.handleRowBtnDisplay( edit );
			}
			else{
				this.handleBtnDisplay( edit );
			}

			if( backup === null ){
				if( !(edit.title && edit.type) ){
					return ;
				}

				this.editBtnPopup.list.push( edit );
			}
			else{
				Object.assign(backup, edit);
			}

			this.editBtnPopup.show = false;

			this.editBtnPopup.backup = null;
		}
		// 取消修改操作按钮
		, cancelEditBtn(){
			this.editBtnPopup.show = false;

			this.editBtnPopup.backup = null;
		}
		// 删除操作按钮
		, deleteBtn(btn, index, toolbars){
			this.$confirm('该操作会删除当前操作按钮，是否继续', '提示', {
				confirmButtonText: '确定'
				, confirmButtonClass: 'el-button--danger'
				, cancelButtonText: '取消'
				, type: 'warning'
				, center: true
			}).then(()=>{
				this.deleteItem(btn, index, toolbars);
			}, ()=>{});
		}

		// 搜索条操作
		, initSearchBar(){
			this.searchItems = this.originalCols.reduce((rs, col)=>{
				if( !this.isSearchable( col ) ){
					return rs;
				}

				let searchItem = this.searchItems.find(([item])=>{
						return item.prop === col.prop;
					})
					;

				if( searchItem ){
					searchItem[0].label = searchItem[0].label || col.label;
					searchItem[0].inject = true;

					if( this.isEnum(col) ){
						searchItem[0].enumType = searchItem[0].enumType || 2;
					}

					rs.push([searchItem[0], col]);
				}
				else{
					rs.push([{
						prop: col.prop
						, label: col.label || col.prop
						, enumType: this.isEnum( col ) ? 2 : undefined
					}, col]);
				}

				return rs;
			}, []);
		}
		, editSearchItem(item, index, formItems, form){
			this.editFormItemPopup.backup = item[0];

			// todo 特殊处理

			this.editFormItemPopup.edit = [{
				inject: true
				, ...item[0]
			}, item[1]];
			this.editFormItemPopup.form = form;

			this.editFormItemPopup.show = true;
		}
		, resetMultipleValue(val){
			let [item] = this.editFormItemPopup.edit
				, prop = item.alias || item.prop
				, form = this.editFormItemPopup.form
				, value
				;

			if( form ){
				value = form[prop];
				form[prop] = val ? [] : Array.isArray( value ) ? `${value[0]}` : ''
			}
		}

		// 处理列参数相关
		, handleColsResult(cols){
			return cols.map((col)=>{
				let { prop, type, hidden    // 基础属性
					, align, label, width   // 显示属性
					, enumCode, enumId      // 枚举类型相关属性
					, formatterCode, formatterId    // 转化函数类型相关属性
					, dateFormat, bind, link        // 日期类型相关属性
					, toFixed                       // 数字类型相关属性
					, btns                          // 操作类型相关属性
					, sortable                      // 排序
					, editable, urlPath, method, params=[]  // 编辑
					} = col
					, property = {}
					;

				// 各个列的特殊属性
				if( this.isEnum(col) ){
					property = {
						enumId: (enumId && enumId !== -1) ? enumId : undefined
						, enumCode: (enumId && enumId !== -1) ? undefined : enumCode
					};
				}
				else if( this.isFormatter(col) ){
					property = {
						formatterId: (formatterId && formatterId !== -1) ? formatterId : undefined
						, formatterCode: (formatterId && formatterId !== -1) ? undefined : formatterCode
					};
				}
				else if( this.isDate(col) ){
					property = {
						dateFormat
						, bind: bind || undefined
						, link: link || undefined
					};
				}

				if( hidden ){
					return {
						prop
						, type
						, label
						, hidden
						, ...property
					};
				}

				// 各个列的特殊属性
				if( this.isNumber(col) ){
					try{
						toFixed = JSON.parse( toFixed );
					}
					catch(e){
						toFixed = undefined;
					}

					property = {
						toFixed
					};
				}
				else if( this.isOperate(col) ){
					btns && (btns = this.handleBtnResult( btns ));

					property = {
						btns
					};
				}

				if( this.isEditable(col) ){
					let url = urlPath && this.handleUrlResult( urlPath )
						;

					params = this.handleParamsResult(params, 1);

					property = {
						...property
						, editable: editable || undefined
						, url: editable ? url : undefined
						, method: editable ? method : undefined
						, params: editable ? params : undefined
					};
				}

				return {
					prop
					, type
					, align
					, label
					, width
					, ...property
					, sortable: sortable || undefined   // todo
				};
			});
		}
		// 处理请求参数相关
		, handleParamsResult(params, type){
			return params.map(({prop, label, alias, inject, hidden, enumType, enumMultiple})=>{
				if( [1, 3].includes(type) ){
					return {
						prop
						, alias: alias || undefined
					};
				}

				return {
					prop
					, label
					, alias
					, inject
					, hidden: inject ? hidden : undefined
					, enumType
					, enumMultiple
				};
			});
		}
		// 处理按钮相关
		, handleBtnResult(toolbars){
			return toolbars.map(({
				title, type, select, multiple
				, urlPath, method, params=[], extQuery
	            , confirm, confirmDesc, confirmBtnDesc
                , popupTitle, displayList, displayCode
				, open})=>{

				let url

				if( type !== 3 ){
					url = urlPath && this.handleUrlResult( urlPath );
				}
				else{
					url = {
						url: urlPath
					};
				}

				params = this.handleParamsResult(params, type);

				// todo 根据类型整理数据字段

				return {
					title
					, type
					, select
					, multiple
					, url
					, open
					, method
					, params
					, extQuery
					, confirm
					, confirmDesc
					, confirmBtnDesc
					, popupTitle
					, displayList: displayList || undefined
					, displayCode: displayList ? undefined : displayCode
				};
			});
		}
		// 处理路径
		, handleUrlResult(url){
			if( url ){
				return this.$domain.getProject( url );
			}
		}
		// 组合绝对路径
		, assemblyUrl(target){
			if( target ){
				return this.$domain.assemblyUrl( target );}

			return '';
		}
		// 提交保存
		, submit(){
			let cols = this.handleColsResult( this.cols )
				, searchItems = this.hasSearchBar ? this.handleParamsResult(this.searchItems.map(([param])=>{
					return param;
				}), 2) : []
				, toolbars = this.handleBtnResult( this.toolbars )
				, api
				,
				{ mainPath, countPath, start, pageSize, extQuery = [] } = this.fetch
				, main, count
				;

			main = this.handleUrlResult( mainPath );
			count = this.handleUrlResult( countPath );

			extQuery.forEach((query)=>{
				try{
					query.value = JSON.parse( query.value );
				}
				catch(e){}
			});

			if( typeof start === 'string' ){
				try{
					start = JSON.parse( start );
				}
				catch(e){}
			}

			if( typeof pageSize === 'string' ){
				try{
					pageSize = JSON.parse( pageSize );
				}
				catch(e){}
			}

			if( !/^\//.test(this.page.path) ){
				this.page.path = `/${this.page.path}`;
			}

			if( this.mode === 'edit' ){
				api = 'pageUpdate';
			}
			else{
				api = 'pageCreate';
			}

			this.$midway[api].post({
				...this.page
				, config: JSON.stringify({
					fetch: {
						...this.fetch
						, mainPath: undefined
						, countPath: undefined
						, main
						, count
						, countMethod: count ? this.fetch.countMethod : undefined
						, start
						, pageSize
					}
					, searchItems
					, toolbars
					, cols
				})
			}).then(({data})=>{
				if( this.mode !== 'edit' ){
					this.id = data.id;
					this.page.id = data.id;
					this.mode = 'edit';
				}
				
				this.$message({
					message: '保存成功'
					, center: true
				});
			});
		}
	}
	, computed: {
		displayStr(){
			if( this.editBtnPopup
				&& this.editBtnPopup.edit
				&& this.editBtnPopup.edit.displayList ){

				let displayList = this.editBtnPopup.edit.displayList
					;

				if( Array.isArray(displayList) ){   // 或关系
					return displayList.map((item)=>{
						return Object.entries( item ).map(([prop, match])=>{
							return `${prop} === ${match}`;
						}).join(' || ')
					}).join(' || ');
				}
				else if( typeof displayList === 'object' ){ // 并关系
					return Object.entries( displayList ).map(([prop, match])=>{
						return `${prop} === ${match}`;
					}).join(' && ');
				}
			}

			return '';
		}
		, canBindDateCol(){
			let targetCol = this.editColPopup.edit
				;

			if( targetCol && this.isDate(targetCol) ){
				return this.cols.reduce((rs, {prop, type, label})=>{
					if( prop && prop !== targetCol.prop && this.isDate({type}) ){
						rs.push({
							prop
							, label: label ? `${label} ${prop}` : prop
						});
					}

					return rs;
				}, []);
			}

			return [];
		}
	}
};
</script>

<style lang="scss">
.settings {
	display: flex;
	justify-content: flex-end;
	overflow: hidden;
	margin-bottom: 20px;
}

.setSearchBar {
	margin-bottom: 20px;
}
.searchBar_form {
	.el-form-item {
		margin-bottom: 0;
		margin-right: 0;
	}
}
.searchBar_form .form_item{
	position: relative;
	display: inline-block;
	margin-bottom: 20px;
	margin-right: 20px;
	padding: 40px 0 0;

	&:hover {
		outline: 1px dashed #c0c0c0;
		outline-offset: 10px;

		.searchBar_item_setting {
			display: flex;
		}
	}

	//.el-button--mini{
	//	padding: 0 7px;
	//}
}
.searchBar_item_setting {
	display: none;
	position: absolute;
	top: 0;
	right: 0;
	justify-content: flex-end;
}

.el-select-dropdown .el-scrollbar {
	background-color: transparent;
}

.toolbars-label .el-form-item__label {
	padding-top: 40px;
}

.input-inline {
	display: flex;
	justify-content: space-between;
	width: 100%;
}

.input-inline .el-input {
	width: auto;
}

.btn-setting-right .el-button {
	float: right;
}

.el-dialog__body{
	overflow: auto;
	max-height: 600px;

	&::-webkit-scrollbar{
		height: 5px;
		width: 5px;
	}
	&::-webkit-scrollbar-thumb{
		display: none;
		height: 20px;
		border-radius: 20px;
		background: #c0c0c0;
	}
	&:hover::-webkit-scrollbar-thumb{
		display: block;
	}
}
</style>