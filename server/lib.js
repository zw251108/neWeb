function formatDate(datetime){
	let date = new Date( datetime )
		, y = date.getFullYear()
		, m = date.getMonth() + 1
		, d = date.getDate()
		, h = date.getHours()
		, mm = date.getMinutes()
		, s = date.getSeconds()
		;

	return `${y}-${m > 9 ? m : '0'+ m}-${d > 9 ? d : '0'+ d} ${h > 9 ? h : '0'+ h}:${mm > 9 ? mm : '0'+ mm}:${s > 9 ? s : '0'+ s}`;
}

export {
	formatDate
};