'use strict';

let i = 0;

let interval = setInterval(function(){

	console.log( i++ );

	if( i > 10 ){
		clearInterval( interval );

		process.exit(0);
	}
}, 2000);

// throw new Error();

process.stdin.setEncoding('utf8');

// console.log( process.env );

// console.log(123123)
// process.stdin.on('readable', () => {
// 	console.log('子线程可输入');
// 	var chunk = process.stdin.read();
// 	if(typeof chunk === 'string'){
// 		process.stdout.write(`stringLength:${chunk.length}\n`);
// 	}
// 	if (chunk !== null) {
// 		process.stdout.write(`data: ${chunk}`);
// 	}
//
// 	process.stdin.emit('close');
// });

process.stdout.write('y/n');
process.stdin.on('readable', ()=>{
	var chunk = process.stdin.read();

	process.stdout.write('\n子线程输入：'+ chunk);

	// process.stdin.emit('end');
})

process.stdout.write('y/n');
//
// process.stdin.on('end', () => {
// 	process.stdout.write('end');
// });

console.log('\n123123');

var rl = require('readline');