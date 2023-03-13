import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App dbUrl='http://157.230.214.56:5000'/>, document.getElementById('root'));
// ReactDOM.render(<App dbUrl='http://127.0.0.1:5050'/>, document.getElementById('root'));
registerServiceWorker();
