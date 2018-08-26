import React from 'react';
import PositionSelect from '../../input/PositionSelect';
import Slider from '../../input/Slider';
import ButtonSelect from '../../input/ButtonSelect';
import _ from 'underscore';

class TriangleInputs extends React.Component {
	constructor(props) {
	  super(props);
	  
	  this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value, name) {
		var state = {};
		state[name] = value;

		const changeDirections = ['top right', 'bottom right', 'bottom left', 'top left'];

		// Update width and height based on chosen direction
		if (name === 'direction') {
			const { type, width } = this.props;

			if (type === 'isosceles' && _.contains(changeDirections, value)) {
				state.height = width;
			}
		}

		const { direction } = this.props;

		if (name === 'width' && _.contains(changeDirections, direction)) {
			state.height = value;
		}

		if (name === 'height' && _.contains(changeDirections, direction)) {
			state.width = value;
		}		
	  
	  this.props.updateGenerator(state);
	}

	render() {
		const { type, direction, width, height } = this.props;

	  return (
	  	<div>
		  	<ButtonSelect
		  		onChange={this.handleChange}
		  		label="Triangle Type"
		  		name="type"
		  		options={[
	  				{ value: 'equilateral', label: 'Equilateral' },
	  				{ value: 'isosceles', label: 'Isosceles' },
	  				{ value: 'scalene', label: 'Scalene' }
	  			]}
	  			value={type}
		  	/>
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