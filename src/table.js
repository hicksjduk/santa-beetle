import React from 'react';
import { PlayerBoard, defaultPlayerData } from './player-board';
import { Game } from './game';
import {randInt} from './utils';

const players = [
	"Jeremy",
	"Rachel",
	"Peter",
	"Kay",
	"Joel",
	"Mark",
	"Lyn",
	"Daniel",
	"Jack",
	"Debbie",
	"Steven",
	"Chris",
	"David",
	"Hannah E",
	"Hannah C"
]

function scramble(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = randInt(i + 1);
		if (i != j)
			[arr[i], arr[j]] = [arr[j], arr[i]];
	}
}

scramble(players);

export class Table extends React.Component {
	render() {
		const board = i => (
			<td>
				<PlayerBoard
					dieValue={this.state.playerData[i].dieValue}
					parts={this.state.playerData[i].parts}
					done={!this.state.playerData[i].needed} />
			</td>
		);
		const onEnd = 2;
		const onSide = Math.ceil((players.length - onEnd * 2) / 2)
		const playerSeat = p => (
			<td>{p}</td>
		);
		const middleRow = i => {
			const index1 = (onEnd + onSide) * 2 - i - 1;
			const index2 = onSide + i;
			const middleCell = i ? "" : <td colspan={onSide} rowspan={onEnd}/>
			return (
				<tr>
					<td>{index1 < players.length ? playerSeat(players[index1]) : ""}</td>
					<td/>
					{middleCell}
					<td/>
					<td>{playerSeat(players[index2])}</td>
				</tr>
			)
		};
		return (
			<table>
				<tr>
					<td />
					<td />
					{players.slice(0, onSide).map(playerSeat)}
					<td />
					<td />
				</tr>
				<tr>
					<td />
					<td style={{borderBottom: 'none'}} colspan={onSide + 2} />
					<td />
				</tr>
				{players.slice(0, onEnd).map((p, i) => middleRow(i))}
				<tr>
					<td />
					<td style={{borderBottom: 'none'}} colspan={onSide + 2} />
					<td />
				</tr>
				<tr>
					<td />
					<td />
					{players.slice(onSide + onEnd, onSide * 2 + onEnd).reverse().map(playerSeat)}
					<td />
					<td />
				</tr>
			</table>
		);
	}
}