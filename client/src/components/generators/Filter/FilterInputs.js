import React from 'react';
import Sliders from '../../input/Sliders';

const sliders = [
  { title: 'Gaussian Blur', name: 'blur', min: 0, max: 300, defaultValue: 0, appendString: 'px' },
  { title: 'Brightness', name: 'brightness', min: 0, max: 500, defaultValue: 100, appendString: '%' },
  { title: 'Contrast', name: 'contrast', min: 0, max: 500, defaultValue: 100, appendString: '%' },
  { title: 'Grayscale', name: 'grayscale', min: 0, max: 100, defaultValue: 0, appendString: '%' },
  { title: 'Invert', name: 'invert', min: 0, max: 100, defaultValue: 0, appendString: '%' },
  { title: 'Opacity', name: 'opacity', min: 0, max: 100, defaultValue: 100, appendString: '%' },
  { title: 'Saturation', name: 'saturate', min: 0, max: 500, defaultValue: 100, appendString: '%' },
  { title: 'Sepia', name: 'sepia', min: 0, max: 100, defaultValue: 0, appendString: '%' },
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
        sliders={sliders}
        onChange={this.handleChange}
        onActiveToggle={this.handleActiveToggle}
        optional={true}
        {...this.props}
      />
		);
	}
}

export default FilterInputs;