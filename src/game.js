import React from 'react';
import { PlayerBoard, defaultPlayerData } from './player-board';
import { randInt } from "./utils";

class Game {
	constructor(baseIndex) {
		this.baseIndex = baseIndex;
	}

	runGame(onChange) {
		this.next = randInt(2);
		const players = [defaultPlayerData(), defaultPlayerData()];
		onChange(this.baseIndex, players);
		setTimeout(() => this.nextTurn(players, onChange), 1000);
	}

	nextTurn(players, onChange) {
		const current = this.next;
		this.next = (this.next + 1) % 2;
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
		this.state = { inPlay: false, playerData: [defaultPlayerData(), defaultPlayerData()] };
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
					{board(0)}
					{button}
					{board(1)}
				</tr>
			</table>
		);
	}

	runGame() {
		const game = new Game(0);
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

