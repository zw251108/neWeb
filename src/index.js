import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import * as serviceWorker from './serviceWorker';

import './App.css';

import Test from './components/test/index.js';

function App(){
    let a = 1
        , b = [{a}, {a}, {a}, {a}]
        ;

    return (<div className="App">
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
    </div>);
}

export default App;


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
