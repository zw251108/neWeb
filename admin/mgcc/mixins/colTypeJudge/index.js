'use strict';

import tableColumnDefault   from '../../components/tableColumns/index.vue';
import tableColumnDate      from '../../components/tableColumns/date.vue';
import tableColumnEdit      from '../../components/tableColumns/edit.vue';
import tableColumnEnum      from '../../components/tableColumns/enum.vue';
import tableColumnFormatter from '../../components/tableColumns/formatter.vue';
import tableColumnOperate   from '../../components/tableColumns/operate.vue';
import tableColumnNumber    from '../../components/tableColumns/number.vue';
import tableColumnImage     from '../../components/tableColumns/img.vue';
import tableColumnCode      from '../../components/tableColumns/code.vue';
import tableColumnTag       from '../../components/tableColumns/tag.vue';

const COL_CONFIG = [{
		type: 'text'
		, title: '文本'
		, com: tableColumnDefault
	}, {
		type: 'number'
		, title: '数字'
		, com: tableColumnNumber
	}, {
		type: 'image'
		, title: '图片'
		, com: tableColumnImage
	}, {
		type: 'date'
		, title: '日期'
		, com: tableColumnDate
	}, {
		type: 'code'
		, title: '代码段'
		, com: tableColumnCode
	}, {
		type: 'enum'
		, title: '枚举'
		, com: tableColumnEnum
	}, {
		type: 'formatter'
		, title: '转化'
		, com: tableColumnFormatter
	}, {
		type: 'operate'
		, title: '操作'
		, com: tableColumnOperate
	}]
	;

const COL_TYPE = [{
		type: 'text'
		, title: '文本'
	}, {
		type: 'number'
		, title: '数字'
	}, {
		type: 'image'
		, title: '图片'
	}, {
		type: 'date'
		, title: '日期'
	}, {
		type: 'code'
		, title: '代码段'
	}, {
		type: 'tag'
		, title: '标签'
	}, {
		type: 'enum'
		, title: '枚举'
	}, {
		type: 'formatter'
		, title: '转化'
	}, {
		type: 'operate'
		, title: '操作'
	}]
	, SEARCH_ABLE_COL = [
		'text'
		, 'number'
		, 'date'
		, 'enum'
	]
	, SORTABLE_COL = [
		'text'
		, 'number'
		, 'date'
	]
	, EDITABLE_COL = [
		'text'
		, 'number'
	]
	, SPECIAL_COL = [
		'selection'
		, 'expand'
	]
	;

// 列是否可以排序
function isSortable(col){
	return SORTABLE_COL.includes( col.type );
}
// 列是否可以编辑
function isEditable(col){
	return EDITABLE_COL.includes( col.type );
}
// 列是否可以搜索
function isSearchable(col){
	return SEARCH_ABLE_COL.includes( col.type );
}
// 列是否为特殊类型
function isSpecialCol(col){
	return SPECIAL_COL.includes( col.type );
}

// 列类型是否为操作
function isOperate(col){
	return col.type === 'operate';
}
// 列类型是否为转化
function isFormatter(col){
	return col.type === 'formatter';
}
// 列是否为枚举类型
function isEnum(col){
	return col.type === 'enum';
}
// 列是否为数字类型
function isNumber(col){
	return col.type === 'number';
}
// 列是否为时间
function isDate(col){
	return col.type === 'date';
}
// 列是否为图片
function isImage(col){
	return col.type === 'image';
}
// 列是否为代码段
function isCode(col){
	return col.type === 'code';
}
// 列是否为标签
function isTag(col){
	return col.type === 'tag';
}

// 列是否为选择类型
function isSelection(col){
	return col.type === 'selection';
}
// 列是否为展开列
function isExpand(col){
	return col.type === 'expand';
}
// 列是否为编辑
function isEdit(col){
	return col.editable;
}

function isSubKey(col){
	return /\./.test( col.prop );
}

function getRowValue(col, row){
	if( isSubKey(col) ){
		let keys = col.prop.split('.')
			, rs = row
			;

		for( let i = 0, j = keys.length; i < j; i++ ){
			try{
				rs = rs[keys[i]];
			}
			catch(e){
				return undefined;
			}
		}

		return rs;
	}
	else{
		return row[col.prop];
	}
}

// 处理转化函数
function handleFormatter($alert, col){
	if( isFormatter(col) ){
		try{
			col.formatterHandler = new Function('v', 'r', 'i', 'data', col.formatterCode);

			return true;
		}
		catch(e){
			$alert('输入的代码无法正常执行', {
				type: 'error'
			});

			return false;
		}
	}

	return false;
}
// 处理枚举
function handleEnum($alert, col){
	if( isEnum(col) ){
		try{
			let enumCode = eval(`(${col.enumCode})` )
				;

			col.enumCode = JSON.stringify( enumCode );
			col.enumTarget = enumCode;
			col.enumHandler = function(row){
				let t = getRowValue(col, row)
					;

				if( t === undefined ){
					return '';
				}

				if( typeof t === 'string' ){
					return t.split(',').map((k)=>{
						return enumCode[k];
					}).join();
				}
				else if( typeof t === 'number' ){
					return enumCode[t];
				}

				return '';
			}

			return true;
		}
		catch(e){
			$alert('输入的代码不符合格式', {
				type: 'error'
			});

			return false;
		}
	}

	return false
}

// 转换日期
function transDate($util, col, row){
	let value = getRowValue(col, row)
		, format = col.dateFormat || ''
		, start = value ? $util.dateFormat(new Date( value ), format) : ''
		;

	if( col.link ){
		let endValue = row[col.bind]
			, end = endValue ? $util.dateFormat(new Date( endValue ), format) : ''
			;

		return `${start} - ${end}`;
	}

	return start;
}

const INDEX = new Map()
	;

INDEX.set(isOperate, 'table-column-operate');
INDEX.set(isDate, 'table-column-date');
INDEX.set(isFormatter, 'table-column-formatter');
INDEX.set(isEnum, 'table-column-enum');
INDEX.set(isEdit, 'table-column-edit');
INDEX.set(isNumber, 'table-column-number');
INDEX.set(isImage, 'table-column-image');
INDEX.set(isCode, 'table-column-code');
INDEX.set(isTag, 'table-column-tag');

function decideColType(col){
	for( let [key, val] of INDEX ){
		if( key(col) ){
			return val;
		}
	}

	return 'table-column-default';
}

export default {
	components: {
		tableColumnDefault
		, tableColumnDate
		, tableColumnEdit
		, tableColumnEnum
		, tableColumnFormatter
		, tableColumnOperate
		, tableColumnNumber
		, tableColumnImage
		, tableColumnCode
		, tableColumnTag
	}
	, methods: {
		// 列是否可以排序
		isSortable
		// 列是否可以编辑
		, isEditable
		// 列是否可以搜索
		, isSearchable
		// 列是否为特殊类型
		, isSpecialCol

		// 列是否为编辑
		, isEdit

		// 列是否为选择类型
		, isSelection
		// 列是否为展开列
		, isExpand

		// 列类型是否为操作
		, isOperate
		// 列类型是否为转化
		, isFormatter
		// 列是否为枚举类型
		, isEnum
		// 列是否为数字类型
		, isNumber
		// 列是否代码段类型
		, isCode
		// 列是否为标签
		, isTag

		// 列是否为时间
		, isDate

		// 列是否为图片
		, isImage

		// 是否为对象子属性及获取值方法
		, isSubKey
		, getRowValue

		// 处理转化函数
		, handleFormatter(col){
			return handleFormatter(this.$alert, col);
		}
		// 处理枚举
		, handleEnum(col){
			return handleEnum(this.$alert, col);
		}

		// 转换日期
		, transDate(col, row){
			return transDate(this.$util, col, row);
		}

		, decideColType
	}
};

export {
	COL_TYPE

    // 列是否可以排序
	, isSortable
	// 列是否可以编辑
	, isEditable
	// 列是否可以搜索
	, isSearchable
	// 列是否为特殊类型
	, isSpecialCol

	// 列是否为编辑
	, isEdit

	// 列是否为选择类型
	, isSelection
	// 列是否为展开列
	, isExpand

	// 列类型是否为操作
	, isOperate
	// 列类型是否为转化
	, isFormatter
	// 列是否为枚举类型
	, isEnum
	// 列是否为数字类型
	, isNumber
	// 列是否代码段类型
	, isCode
	// 列是否为标签
	, isTag

	// 列是否为时间
	, isDate

	// 列是否为图片
	, isImage

	// 是否为对象子属性及获取值方法
	, isSubKey
	, getRowValue

	// 处理转化函数
	, handleFormatter
	// 处理枚举
	, handleEnum

	// 转换日期
	, transDate

	, decideColType

	, tableColumnDefault
	, tableColumnDate
	, tableColumnEdit
	, tableColumnEnum
	, tableColumnFormatter
	, tableColumnOperate
	, tableColumnNumber
	, tableColumnImage
	, tableColumnCode
	, tableColumnTag
};