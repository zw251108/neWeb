'use strict';

import maple from 'cyan-maple';

const DAYS_OF_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
	,
	{ util } = maple
	,
	{ dateFormat } = util
	;

function isLeapYear(year){
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

dateFormat._dateStrReplace.MED = (date)=>{
	let y = date.getFullYear()
		, m = date.getMonth()
		, d = DAYS_OF_MONTH[m]
		;

	if( m === 1 && isLeapYear(y) ){
		d = 29
	}

	return d;
};