import React from 'react';
import './App.css';

import Test from './components/test/index.js';

function App(){
	let a = 1
		, b = [{a}, {a}, {a}, {a}]
		;

	return (
		<div className="App">
			<header className="App-header">
				{/*<img src={logo} className="App-logo" alt="logo" />*/}
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<Test msg="zwb"/>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React {a}
					{b.map(({a})=>{
						return (<div><span>{a}</span></div>);
						
					})}
				</a>
			</header>
		</div>
	);
}

export default App;
