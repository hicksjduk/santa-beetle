import React from 'react';
import { PlayerBoard, defaultPlayerData } from './player-board';
import { Game } from './game';
import { randInt, range } from './utils';

const playerList = [
	{ name: "Jeremy" },
	{ name: "Rachel" },
	{ name: "Peter" },
	{ name: "Kay" },
	{ name: "Joel" },
	{ name: "Mark" },
	{ name: "Lyn" },
	{ name: "Daniel" },
	{ name: "Jack" },
	{ name: "Debbie" },
	{ name: "Steven" },
	{ name: "Chris" },
	{ name: "David" },
	{ name: "Hannah E" },
	{ name: "Hannah C" }
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
		const players = playerList.map(p => Object.assign({}, p, {wins: 0}));
		scramble(players);
		const playerData = players.map(i => defaultPlayerData());
		this.state = ({ gamesInProgress: 0, movingOn: false, players: players, playerData: playerData });
	}

	playerSeat(i, rows = 1) {
		const players = this.state.players;
		if (i < players.length) {
			const p = players[i];
			return (
				<td rowspan={rows}>
					{p.name} <br/>
					{p.wins} {p.wins == 1 ? "win" : "wins"}
				</td>
			);
		}
		return (<td rowspan={rows}/>);
	}

	board(i, rows = 1) {
		const players = this.state.players;
		const playerData = this.state.playerData;
		if (i < players.length)
			return (
				<td rowspan={rows} style={{ backgroundColor: colours[Math.floor(i / 2)] }}>
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
	
	moveOn() {
		const players = this.state.players.slice();
		const sourceIndices = this.state.winners.slice().sort((a, b) => a - b);
		if (players.length % 2)
			sourceIndices.push(players.length - 1);
		const sourceObjects = sourceIndices.map(i => players[i]);
		const targetIndices = sourceIndices.slice(1).concat(sourceIndices.slice(0, 1));
		while (targetIndices.length)
			players[targetIndices.pop()] = sourceObjects.pop();
		this.setState({players: players, movingOn: false});
	}

	startGame() {
		const playerData = this.state.playerData.map(pd => defaultPlayerData());
		const games = range(0, playerData.length - playerData.length % 2, 2).map(i => new Game(i));
		this.setState({ gamesInProgress: games.length, playerData: playerData, winners: [], message: "Ready..." });
		setTimeout(() => {
			this.setState({ message: "Ready... Steady..." });
			setTimeout(() => {
				this.setState({ message: "Ready... Steady... Ho!" });
				setTimeout(() => {
					games.forEach(g => g.runGame((index, players) => this.onChange(index, players, g)));
				}, 500);
				setTimeout(() => this.setState({message: ""}), 10000);
			}, 500);
		}, 500);
	}

	onChange(index, players, game) {
		const newPlayers = this.state.playerData.slice();
		newPlayers.splice(index, players.length, ...players);
		const winner = game.winner;
		if (winner != undefined)
		{
			const gamesInProgress = this.state.gamesInProgress - 1;
			const winners = this.state.winners.slice();
			winners.push(winner);
			const players = this.state.players.slice();
			const winningPlayer = players[winner];
			players[winner] = Object.assign({}, winningPlayer, {wins: winningPlayer.wins + 1});
			this.setState({ gamesInProgress: gamesInProgress, movingOn: !gamesInProgress, winners: winners, playerData: newPlayers, players: players });
		}
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
						{/*<p>{JSON.stringify(this.state)}</p>*/}
						<button style={{ visibility: this.state.gamesInProgress || this.state.movingOn ? 'hidden' : 'visible' }}
							onClick={() => this.startGame()}>Play</button>
						<span style={{ visibility: this.state.gamesInProgress ? 'visible' : 'hidden' }}>
							{this.state.message}
						</span>
						<button style={{ visibility: !this.state.movingOn ? 'hidden' : 'visible' }}
							onClick={() => this.moveOn()}>Move on</button>
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