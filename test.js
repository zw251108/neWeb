'use strict';

let i = 0;

// let interval = setInterval(function(){
//
// 	console.log( i++ );
//
// 	if( i > 10 ){
// 		clearInterval( interval );
//
// 		process.exit(0);
// 	}
// }, 2000);

// throw new Error();

process.stdin.setEncoding('utf8');

// console.log( process.env );

console.log(123123)
process.stdin.on('readable', () => {
	console.log(111);
	var chunk = process.stdin.read();
	if(typeof chunk === 'string'){
		process.stdout.write(`stringLength:${chunk.length}\n`);
	}
	if (chunk !== null) {
		process.stdout.write(`data: ${chunk}`);
	}
});

process.stdin.on('end', () => {
	process.stdout.write('end');
});