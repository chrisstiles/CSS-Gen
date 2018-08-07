import React from 'react';
import Sliders from '../../input/Sliders';

const test = [
  { title: 'Gaussian Blur', name: 'blur', min: 0, max: 100 },
  { title: 'Invert', name: 'invert', min: 0, max: 100 },
  { title: 'Saturation', name: 'saturate', min: 0, max: 100 }
];

class FilterInputs extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleActiveToggle = this.handleActiveToggle.bind(this);
	}

	handleChange(value, name) {
		const state = {};
		state[name] = value;

		this.props.owner.setState(state);
	}

	handleActiveToggle(active, name) {
		if (!active) {
			const state = {};
			state[name] = null;

			this.props.owner.setState(state);
		}
	}

	render() {
		return (
			<Sliders
        sliders={test}
        onChange={this.handleChange}
        onActiveToggle={this.handleActiveToggle}
        optional={true}
        {...this.props}
      />
		);
	}
}

export default FilterInputs;