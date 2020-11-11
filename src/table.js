import React from 'react';
import { PlayerBoard, defaultPlayerData } from './player-board';
import { Game } from './game';
import { randInt, range } from './utils';

const playerList = [
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

export class Table extends React.Component {
	constructor(props) {
		super(props);
		const players = playerList.slice();
		scramble(players);
		this.state = ({ players: players });
	}

	playerSeat(i, rows = 1) {
		const players = this.state.players;
		const p = i < players.length ? `${i} ${players[i]}` : "";
		return (<td rowspan={rows}>{p}</td>);
	}

	board(i, rows = 1) {
		const players = this.state.players;
		const b = i < players.length ? `Board ${i}` : "";
		return (<td rowspan={rows}>{b}</td>);
		/* <td>
			<PlayerBoard
				dieValue={this.state.playerData[i].dieValue}
				parts={this.state.playerData[i].parts}
				done={!this.state.playerData[i].needed} />
		</td> */
	}

	middleRow(leftIndex, rightIndex, middle) {
		return (
			<tr>
				{this.playerSeat(leftIndex)}
				{this.board(leftIndex)}
				{this.board(rightIndex)}
				{this.playerSeat(rightIndex)}
			</tr>
		);
	}

	render() {
		const players = this.state.players;
		const onEnd = 2;
		const onSide = Math.ceil((players.length - onEnd * 2) / 2)

		return (
			<table style={{ align: 'center', textAlign: 'center', verticalAlign: 'middle' }}>
				<tr>
					<td colspan={3} />
					{range(0, onSide).map(i => this.playerSeat(i))}
				</tr>
				<tr>
					<td colspan={2} />
					<td colspan={onSide + 2} style={{ borderBottom: 'solid', borderWidth: 'thin' }} />
				</tr>
				<tr>
					{this.playerSeat((onSide + onEnd) * 2, 2)}
					<td rowspan={onEnd + 2} style={{ borderRight: 'solid', borderWidth: 'thin' }} />
					{this.board((onSide + onEnd) * 2, 2)}
					{range(0, onSide).map(i => this.board(i))}
					{this.board(onSide, 2)}
					<td rowspan={onEnd + 2} style={{ borderLeft: 'solid', borderWidth: 'thin' }} />
					{this.playerSeat(onSide, 2)}
				</tr>
				<tr>
					<td rowspan={onEnd} colspan={onSide}>Middle</td>
				</tr>
				{range(1, onEnd - 1).map(i => this.middleRow((onSide + onEnd) * 2 - 1 - i, onSide + i))}
				<tr>
					{this.playerSeat(onSide * 2 + onEnd, 2)}
					{this.board(onSide * 2 + onEnd, 2)}
					{this.board(onSide + onEnd - 1, 2)}
					{this.playerSeat(onSide + onEnd - 1, 2)}
				</tr>
				<tr>
					{range(onSide * 2 + onEnd - 1, onSide + onEnd - 1).map(i => this.board(i))}
				</tr>
				<tr>
					<td colspan={2} />
					<td colspan={onSide + 2} style={{ borderTop: 'solid', borderWidth: 'thin' }} />
				</tr>
				<tr>
					<td colspan={3} />
					{range(onSide * 2 + onEnd - 1, onSide + onEnd - 1).map(i => this.playerSeat(i))}
				</tr>
			</table>
		);
	}
}