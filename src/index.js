import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App dbUrl='http://10.27.33.141:5000'/>, document.getElementById('root'));
registerServiceWorker();
