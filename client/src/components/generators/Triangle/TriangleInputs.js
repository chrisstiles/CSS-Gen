import React from 'react';
import PositionSelect from '../../input/PositionSelect';
import _ from 'underscore';

class TriangleInputs extends React.Component {
	constructor(props) {
	  super(props);
	  
	  this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value, name) {
		var state = {};
		state[name] = value;

		// Update width and height based on chosen direction
		if (name === 'direction') {
			const { type, width } = this.props;
			const directions = ['top right', 'bottom right', 'bottom left', 'top left'];

			if (type === 'isosceles' && _.contains(directions, value)) {
				state.height = width;
			}
		}
	  
	  this.props.updateGenerator(state);
	}

	render() {
	  return (
	  	<PositionSelect
	  	  label="Triangle Direction"
	  	  name="direction"
	  	  position={this.props.direction}
	  	  onClick={this.handleChange}
	  	  includeCenter={false}
	  	/>
	  );
	}
}

export default TriangleInputs;