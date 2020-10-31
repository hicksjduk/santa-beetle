import React from 'react';

import head from './images/body/head.jpg';
import leftArm from './images/body/left-arm.jpg';
import rightArm from './images/body/right-arm.jpg';
import leftLeg from './images/body/left-leg.jpg';
import rightLeg from './images/body/right-leg.jpg';
import body from './images/body/body.jpg';

export class Santa extends React.Component {
	render() {
		return (
			<table style={{textAlign: 'center'}}>
				<tr>
					<td/>
					<td colspan={2}><img src={head} style={{visibility: this.visibility(0)}}/></td>
					<td/>
				</tr>	
				<tr>
					<td><img src={leftArm} style={{visibility: this.visibility(1)}}/></td>
					<td colspan={2}><img src={body} style={{visibility: this.visibility(5)}}/></td>
					<td><img src={rightArm} style={{visibility: this.visibility(2)}}/></td>
				</tr>	
				<tr>
					<td colspan={2}><img src={leftLeg} style={{visibility: this.visibility(3)}}/></td>
					<td colspan={2}><img src={rightLeg} style={{visibility: this.visibility(4)}}/></td>
				</tr>	
			</table>
		);
	}
	
	visibility(i) {
		return this.props.parts[i] ? 'visible' : 'hidden'; 
	}
}

export class SantaTest extends React.Component {
	state = {parts: Array(6).fill(false)};

	render() {
		return (
			<span>
				<Santa parts={this.state.parts}/>
				<br/><button onClick={() => {
					const index = Math.floor(Math.random() * 6);
					const newParts = this.state.parts.slice();
					newParts[index] = !newParts[index];
					this.setState({parts: newParts});
				}}>Toggle</button>
			</span>
		);
	}
}