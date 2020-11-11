import React from 'react';
import { Die } from './die';
import { Santa } from './santa';

export class PlayerBoard extends React.Component {
	render() {
		return (
			<span>
				<Die value={this.props.dieValue} />
				<Santa parts={this.props.parts} />
				<p>{this.props.done ? 'Ho ho ho!' : ''}</p>
			</span>
		);
	}
}

export class PlayerBoardTest extends React.Component {
	state = defaultPlayerData();

	render() {
		return (
			<span>
				<button disabled={!this.state.needed}
					onClick={() => this.next()}>Next</button>
				<br />
				<PlayerBoard
					dieValue={this.state.dieValue}
					parts={this.state.parts}
					done={!this.state.needed} />
			</span>
		);
	}

	next() {
		const parts = this.state.parts.slice();
		const thrown = Math.floor(Math.random() * 6);
		if (!parts[thrown] && (thrown == 5 || parts[5])) {
			parts[thrown] = true;
			this.setState({ dieValue: thrown, parts: parts, needed: this.state.needed - 1 });
		} else
			this.setState({ dieValue: thrown });
	}
}

export function defaultPlayerData() {
	return { dieValue: null, parts: Array(6).fill(false), needed: 6 };
}