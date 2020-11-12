import React from 'react';
import image1 from './images/dice/1.gif';
import image2 from './images/dice/2.gif';
import image3 from './images/dice/3.gif';
import image4 from './images/dice/4.gif';
import image5 from './images/dice/5.gif';
import image6 from './images/dice/6.gif';

const dieImages = [image1, image2, image3, image4, image5, image6];

export class Die extends React.Component {
	render() {
		const value = this.props.value;
		return (
			<span style={{ visibility: value === null ? 'hidden' : 'visible' }}>
				<img src={dieImages[value === null ? 0 : value]} />
			</span>
		);
	}
}

export class DieTest extends React.Component {
	state = { value: 0 };

	render() {
		return (
			<span>
				<Die value={this.state.value} />
				<br /><button onClick={() => {
					const newValue = this.state.value !== null ? null : Math.floor(Math.random() * 6);
					this.setState({ value: newValue });
				}}>Next</button>
			</span>
		);
	}
}