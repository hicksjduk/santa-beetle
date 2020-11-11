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

const colours = [
	"AliceBlue",
	"Beige",
	"LavenderBlush",
	"HoneyDew",
	"Linen",
	"PaleTurquoise",
	"Pink"
];

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
		const playerData = players.map(i => defaultPlayerData());
		this.state = ({ gamesInProgress: 0, players: players, playerData: playerData });
	}

	playerSeat(i, rows = 1) {
		const players = this.state.players;
		const p = i < players.length ? `${i} ${players[i]}` : "";
		return (<td rowspan={rows}>{p}</td>);
	}

	board(i, rows = 1) {
		const players = this.state.players;
		const playerData = this.state.playerData;
		if (i < players.length)
			return (
				<td rowspan={rows} style={{backgroundColor: colours[Math.floor(i / 2)]}}>
					<PlayerBoard
						dieValue={playerData[i].dieValue}
						parts={playerData[i].parts}
						done={!playerData[i].needed} />
				</td>
			);
		return (<td rowspan={rows} />);
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
	
	startGame() {
		const playerData = this.state.playerData;
		const games = range(0, playerData.length - playerData.length % 2, 2).map(i => new Game(i));
		this.setState({gamesInProgress: games.length});
		games.forEach(g => g.runGame((index, players) => this.onChange(index, players)))
	}

	onChange(index, players) {
		const newPlayers = this.state.playerData.slice();
		newPlayers.splice(index, players.length, ...players);
		if (players.find(p => !p.needed))
			this.setState({ gamesInProgress: this.state.gamesInProgress - 1, playerData: newPlayers });
		else
			this.setState({ playerData: newPlayers });
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
					<td rowspan={onEnd} colspan={onSide}>
						<button disabled={this.state.gamesInProgress} onClick={() => this.startGame()}>Play</button>
					</td>
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