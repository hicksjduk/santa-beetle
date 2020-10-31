import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Die, DieTest} from './die';
import {Santa, SantaTest} from './santa';

ReactDOM.render(
  <React.StrictMode>
    <SantaTest />
  </React.StrictMode>,
  document.getElementById('root')
);
