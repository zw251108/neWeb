import ReactDOM from 'react-dom/client';

import './sass/index.scss'

import './config.js';
import App from './App.js';

const root = ReactDOM.createRoot( document.getElementById('root') )
    ;

root.render(<App />);