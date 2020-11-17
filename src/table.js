import React from 'react';
import { PlayerBoard, defaultPlayerData } from './player-board';
import { Game } from './game';
import { randInt, range } from './utils';

import jeremy from './images/avatars/jeremy.jpg';
import rachel from './images/avatars/rachel.jpeg';
import peter from './images/avatars/peter.jpeg';
import kay from './images/avatars/kay.jpeg';
import joel from './images/avatars/joel.jpeg';
import debbie from './images/avatars/debbie.jpeg';
import steven from './images/avatars/steven.jpeg';
import chris from './images/avatars/chris.jpeg';
import hannahe from './images/avatars/hannahe.jpeg';
import david from './images/avatars/david.jpeg';
import hannahc from './images/avatars/hannahc.jpeg';
import mark from './images/avatars/mark.jpeg';
import lyn from './images/avatars/lyn.png';
import daniel from './images/avatars/daniel.jpeg';
import jack from './images/avatars/jack.jpeg';


const playerList = [
	{ name: "Jeremy", avatar: jeremy },
	{ name: "Rachel", avatar: rachel },
	{ name: "Peter", avatar: peter },
	{ name: "Kay", avatar: kay },
	{ name: "Joel", avatar: joel},
	{ name: "Mark", avatar: mark },
	{ name: "Lyn", avatar: lyn },
	{ name: "Daniel", avatar: daniel },
	{ name: "Jack", avatar: jack },
	{ name: "Debbie", avatar: debbie },
	{ name: "Steven", avatar: steven },
	{ name: "Chris", avatar: chris },
	{ name: "David", avatar: david },
	{ name: "Hannah E", avatar: hannahe },
	{ name: "Hannah C", avatar: hannahc }
];

const targetWins = Math.floor(playerList.length / 2);

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
		const players = playerList.map(p => Object.assign({ wins: 0 }, p));
		scramble(players);
		const playerData = players.map(i => defaultPlayerData());
		this.state = ({ gamesInProgress: 0, stage: { aboutToPlay: true }, players: players, playerData: playerData });
	}

	playerSeat(i, rows = 1) {
		const players = this.state.players;
		if (i < players.length) {
			const p = players[i];
			return (
				<td rowspan={rows}>
					<img style={{ verticalAlign: 'middle' }} src={p.avatar} />
					<span style={{ verticalAlign: 'middle' }}>
						<br />{p.name} <br />
						{p.wins} {p.wins == 1 ? "win" : "wins"}
					</span>
				</td>
			);
		}
		return (<td rowspan={rows} />);
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
		this.setState({ players: players, stage: { aboutToPlay: true } });
	}

	startGame() {
		const playerData = this.state.playerData.map(pd => defaultPlayerData());
		const games = range(0, playerData.length - playerData.length % 2, 2).map(i => new Game(i));
		this.setState({ gamesInProgress: games.length, playerData: playerData, winners: [], stage: {}, message: "Ready..." });
		setTimeout(() => {
			this.setState({ message: "Ready... Steady..." });
			setTimeout(() => {
				this.setState({ message: "Ready... Steady... Ho!" });
				setTimeout(() => {
					games.forEach(g => g.runGame((index, players) => this.onChange(index, players, g)));
				}, 500);
				setTimeout(() => this.setState({ message: "" }), 10000);
			}, 500);
		}, 500);
	}

	onChange(index, players, game) {
		const newPlayers = this.state.playerData.slice();
		newPlayers.splice(index, players.length, ...players);
		const winner = game.winner;
		if (winner != undefined) {
			const gamesInProgress = this.state.gamesInProgress - 1;
			const winners = this.state.winners.slice();
			winners.push(winner);
			const players = this.state.players.slice();
			const winningPlayer = players[winner];
			const winnersWins = winningPlayer.wins + 1;
			players[winner] = Object.assign({}, winningPlayer, { wins: winnersWins });
			let gameOver = false;
			let message = "";
			let stage = {};
			if (!gamesInProgress) {
				const winnerIndices = players.map((p, i) => i).filter(i => players[i].wins >= targetWins)
					.reduce((acc, i) => {
						const difference = players[i].wins - (acc.length ? players[acc[0]].wins : 0);
						if (difference > 0)
							return [i];
						if (difference == 0)
							acc.push(i);
						return acc;
					}, []);
				gameOver = winnerIndices.length;
				if (winnerIndices.length == 1) {
					message = `Game over! The winner is ${players[winnerIndices[0]].name}.`;
					stage = {gameOver: true};
				}
				else if (winnerIndices.length > 1) {
					const winners = winnerIndices.map(i => players[i].name);
					message = `${winners.slice(0, -1).join(', ')} and ${winners.slice(-1)} need to play off to determine the winner.`;
					stage = {playoff: true, playerIndices: winnerIndices};
				}
				else
				   stage = {movingOn: true};
			}
			this.setState({
				gamesInProgress: gamesInProgress, winners: winners, playerData: newPlayers, players: players,
				stage: stage, message: message
			});
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
						<button style={{ visibility: this.state.stage.aboutToPlay ? 'visible' : 'hidden' }}
							onClick={() => this.startGame()}>Play</button>
						<span>{this.state.message}</span>
						<button style={{ visibility: this.state.stage.movingOn ? 'visible' : 'hidden' }}
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