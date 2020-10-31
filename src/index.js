import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Die, DieTest} from './die';
import {Santa, SantaTest} from './santa';
import {PlayerBoard, PlayerBoardTest} from './player-board';

ReactDOM.render(
  <React.StrictMode>
    <PlayerBoardTest/>
  </React.StrictMode>,
  document.getElementById('root')
);
