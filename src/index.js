import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Die, DieTest} from './die';
import {Santa, SantaTest} from './santa';
import {PlayerBoard, PlayerBoardTest} from './player-board';
import {GameTestBoard} from './game';

ReactDOM.render(
  <React.StrictMode>
    <GameTestBoard/>
  </React.StrictMode>,
  document.getElementById('root')
);
