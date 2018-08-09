import React from 'react';
import Sliders from '../../input/Sliders';
import AnglePicker from '../../input/AnglePicker';
import _ from 'underscore'; 

class FilterInputs extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
		this.handleActiveToggle = this.handleActiveToggle.bind(this);
	}

	handleChange(value, name, key = 'value') {
    const { owner } = this.props;
		const state = {};
    
    if (typeof owner.state[name] === 'object') {
      const previousState = owner.state[name];
      const properties = {};
      properties[key] = value;
      state[name] = _.extend({}, previousState, properties);
    } else {
      state[name] = value;
      owner.setState(state);
    }

    owner.setState(state);
	}

	handleActiveToggle(value, name) {
    this.handleChange(value, name, 'isActive');
	}

	render() {
		return (
			<Sliders
        sliders={this.props.filterSliders}
        onChange={this.handleChange}
        onActiveToggle={this.handleActiveToggle}
        optional={true}
        {...this.props}
      />
		);
	}
}

export default FilterInputs;