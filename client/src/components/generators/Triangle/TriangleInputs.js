import React from 'react';
import PositionSelect from '../../input/PositionSelect';

class TriangleInputs extends React.Component {
	constructor(props) {
	  super(props);
	  
	  this.handleChange = this.handleChange.bind(this);
	}

	handleChange(value, name) {
	  var state = {};
	  state[name] = value;
	  
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