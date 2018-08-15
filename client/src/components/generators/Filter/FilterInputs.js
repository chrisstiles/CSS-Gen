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
		const state = {};
    // console.log(this.props[name])
    if (typeof this.props[name] === 'object') {
      const previousState = this.props[name];
      const properties = {};
      properties[key] = value;
      state[name] = _.extend({}, previousState, properties);
    } else {
      state[name] = value;
    }

    // state[name] = value;

    this.props.updateGenerator(state);
	}

	handleActiveToggle(value, name) {
    this.handleChange(value, name, 'isActive');
	}

	render() {
		return (
      <div>
        <AnglePicker
          label="Hue Rotate"
          angle={this.props.hueRotate.value}
          onChange={this.handleChange}
          onActiveToggle={this.handleActiveToggle}
          isActive={this.props.hueRotate.isActive}
          name="hueRotate"
          optional={true}
        />
  			<Sliders
          sliders={this.props.filterSliders}
          onChange={this.handleChange}
          onActiveToggle={this.handleActiveToggle}
          optional={true}
          {...this.props}
        />
      </div>
		);
	}
}

export default FilterInputs;