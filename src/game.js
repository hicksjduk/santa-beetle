import React from 'react';
import { PlayerBoard, defaultPlayerData } from './player-board';
import { randInt } from "./utils";

class Game {
	next = randInt(2);

	nextTurn(players) {
		const other = (this.next + 1) % 2;
		const answer = players.map((p, i) => this.throw(p, i == other ? null : randInt(6)));
		this.next = other;
		return answer;
	}

	throw(player, thrown) {
		const answer = Object.assign({}, player)
		answer.dieValue = thrown;
		if (thrown === null)
			return answer;
		const parts = answer.parts;
		if (!parts[thrown] && (thrown == 5 || parts[5])) {
			parts[thrown] = true;
			answer.needed--;
		}
		return answer;
	}
}

export class GameTestBoard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {inPlay: false, finished: false, playerData: [defaultPlayerData(), defaultPlayerData()] };
		this.game = new Game();
	}

	render() {
		return (
			<table>
				<tr>
					<td>
						<PlayerBoard
							dieValue={this.state.playerData[0].dieValue}
							parts={this.state.playerData[0].parts}
							done={!this.state.playerData[0].needed} />
					</td>
					<td>
						<button
							disabled={this.state.inPlay} 
							onClick={() => this.runGame()}>Run game</button>
					</td>
					<td>
						<PlayerBoard
							dieValue={this.state.playerData[1].dieValue}
							parts={this.state.playerData[1].parts}
							done={!this.state.playerData[1].needed} />
					</td>
				</tr>
			</table>
		);
	}
	
	runGame() {
		const game = new Game();
		this.setState({inPlay: true, playerData: [defaultPlayerData(), defaultPlayerData()] });
		this.nextAfter(game, 1000);
	}
	
	nextAfter(game, timeout) {
		setTimeout(() => this.next(game), timeout);
	} 

	next(game) {
		const playerData = game.nextTurn(this.state.playerData);
		const finished = playerData.find(pd => !pd.needed);
		this.setState({inPlay: !finished, playerData: playerData });
		if (!finished)
			this.nextAfter(game, 1000);
	}
}

