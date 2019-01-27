import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

/*ReactDOM.render(<App dbUrl='mongodb://admin:Password13@ds131826.mlab.com:31826/new-db-starkey'/>, document.getElementById('root'));*/
ReactDOM.render(<App dbUrl='http://192.168.1.6:5000'/>, document.getElementById('root'));
registerServiceWorker();
