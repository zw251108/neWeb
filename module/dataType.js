var dataType = {
	tinyint: {
		valid: [
			['isNumber']
			, ['limit', -Math.pow(2, 7), Math.pow(2, 7)-1]
		]
	}
	, tinyint_unsigned: {
		valid: [
			['isNumber']
			, ['limit', 0, Math.pow(2, 8)]
		]
	}
	, smallint: {
		valid: [
			['isNumber']
			, ['limit', -Math.pow(2, 15), Math.pow(2, 15)-1]
		]
	}
	, smallint_unsigned: {
		valid: [
			['isNumber']
			, ['limit', 0, Math.pow(2, 16)]
		]
	}
	, mediumint: {
		valid: [
			['isNumber']
			, ['limit', -Math.pow(2, 23), Math.pow(2, 23)-1]
		]
	}
	, mediumint_unsigned: {
		valid: [
			['isNumber']
			, ['limit', 0, Math.pow(2, 24)]
		]
	}
	, 'int': {
		valid: [
			['isNumber']
			, ['limit', -Math.pow(2, 31), Math.pow(2, 31)-1]
		]
	}
	, int_unsigned: {
		valid: [
			['isNumber']
			, ['limit', 0, Math.pow(2, 32)]
		]
	}
	, bigint: {
		valid: [
			['isNumber']
			, ['limit', -Math.pow(2, 63), Math.pow(2, 63)-1]
		]
	}
	, 'float': {
		valid: [
			['isNumber']
			, ['limit']
		]
	}
	, double: {
		valid: [
			['isNumber']
			, ['limit']
		]
	}
	, decimal: {
		valid: [
			['decimal']
		]
	}
	, 'char': {
		valid: [
			['length', 0, 255]
		]
	}
	, varchar: {
		valid: [
			['length', 0, 65535]
		]
	}
	, tinytext: {
		valid: [
			['length', 0, 255]
		]
	}
	, text: {
		valid: [
			['length', 0, 65535]
		]
	}
	, mediumtext: {
		valid: [
			['length', 0, Math.pow(2, 24)-1]
		]
	}
	, longtext: {
		valid: [
			['length', 0, Math.pow(2, 32)-1]
		]
	}
};