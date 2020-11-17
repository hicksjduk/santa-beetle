import React from 'react';
import { PlayerBoard, defaultPlayerData } from './player-board';
import { randInt, range } from "./utils";

export class Game {
	constructor(baseIndex, playerCount=2) {
		this.baseIndex = baseIndex;
		this.playerCount = playerCount;
	}

	runGame(onChange) {
		this.next = randInt(this.playerCount);
		const players = Array.from({length: this.playerCount}, i => defaultPlayerData());
		onChange(this.baseIndex, players);
		setTimeout(() => this.nextTurn(players, onChange), 1000);
	}

	nextTurn(players, onChange) {
		const current = this.next;
		this.next = (this.next + 1) % this.playerCount;
		const pd = players.map((p, i) =>
			Object.assign({}, p, { dieValue: i == current ? randInt(6) : null }));
		onChange(this.baseIndex, pd);
		setTimeout(() => this.adjustForThrow(current, pd, onChange), 500);
	}

	adjustForThrow(index, players, onChange) {
		const player = players[index];
		const thrown = player.dieValue;
		const parts = player.parts;
		let workPlayers = players;
		if (thrown == 5 || parts[5])
			if (!parts[thrown]) {
				workPlayers = [...players];
				const p = Object.assign({}, workPlayers[index]);
				workPlayers[index] = p;
				p.parts[thrown] = true;
				const needed = --p.needed;
				if (!needed)
					this.winner = this.baseIndex + index;
				onChange(this.baseIndex + index, [p]);
				if (!needed)
					return;
			}
		setTimeout(() => this.nextTurn(workPlayers, onChange), 500);
	}

}

export class GameTestBoard extends React.Component {
	constructor(props) {
		super(props);
		const playerCount = props.playerCount || 2;
		const playerData = Array.from({length: playerCount}, i => defaultPlayerData());
		this.state = { inPlay: false, playerData: playerData };
	}

	render() {
		const board = i => (
			<td>
				<PlayerBoard
					dieValue={this.state.playerData[i].dieValue}
					parts={this.state.playerData[i].parts}
					done={!this.state.playerData[i].needed} />
			</td>
		);
		const button = (
			<td>
				<button
					disabled={this.state.inPlay}
					onClick={() => this.runGame()}>Run game</button>
			</td>
		);
		return (
			<table>
				<tr>
					{range(0, this.props.playerCount).map(i => board(i))}
					{button}
				</tr>
			</table>
		);
	}

	runGame() {
		const game = new Game(0, this.props.playerCount);
		this.setState({ inPlay: true });
		game.runGame((index, players) => this.onChange(index, players));
	}

	onChange(index, players) {
		const newPlayers = this.state.playerData.slice();
		newPlayers.splice(index, players.length, ...players);
		const finished = players.find(p => !p.needed);
		this.setState({ inPlay: !finished, playerData: newPlayers });
	}
}

