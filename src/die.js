import React from 'react';
import image1 from './images/dice/1.jpg';
import image2 from './images/dice/2.jpg';
import image3 from './images/dice/3.jpg';
import image4 from './images/dice/4.jpg';
import image5 from './images/dice/5.jpg';
import image6 from './images/dice/6.jpg';

const dieImages = [image1, image2, image3, image4, image5, image6];

export class Die extends React.Component {
	render() {
		return (
			<span style={{ visibility: this.props.value === null ? 'hidden' : 'visible' }}>
				<img style={{ width: 50 }} src={dieImages[this.props.value]} />
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