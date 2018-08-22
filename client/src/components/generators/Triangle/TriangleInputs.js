import React from 'react';
import PositionSelect from '../../input/PositionSelect';
import Slider from '../../input/Slider';
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
		const { direction, width, height } = this.props;

	  return (
	  	<div>
		  	<PositionSelect
		  	  label="Triangle Direction"
		  	  name="direction"
		  	  position={direction}
		  	  onClick={this.handleChange}
		  	  includeCenter={false}
		  	/>
		  	<Slider
		  	  title="Width"
		  	  name="width"
		  	  onChange={this.handleChange}
		  	  value={width}
		  	  min={1}
		  	  max={800}
		  	  appendString="px"
		  	/>
		  	<Slider
		  	  title="Height"
		  	  name="height"
		  	  onChange={this.handleChange}
		  	  value={height}
		  	  min={1}
		  	  max={800}
		  	  appendString="px"
		  	/>
	  	</div>
	  );
	}
}

export default TriangleInputs;