import React from 'react';
import Sliders from '../../input/Sliders';
import AnglePicker from '../../input/AnglePicker';
import ColorPicker from '../../input/ColorPicker';
import tinycolor from 'tinycolor2';
import _ from 'underscore';

class FilterInputs extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
    this.handleDropShadowChange = this.handleDropShadowChange.bind(this);
		this.handleActiveToggle = this.handleActiveToggle.bind(this);
	}

	handleChange(value, name, key = 'value') {
		const state = {};

    if (typeof this.props[name] === 'object') {
      const previousState = this.props[name];
      const properties = {};
      properties[key] = value;
      state[name] = _.extend({}, previousState, properties);
    } else {
      state[name] = value;
    }

    this.props.updateGenerator(state);
	}

  handleDropShadowChange(value, name) {
    const state = {
      dropShadow: _.extend({}, this.props.dropShadow)
    }

    // Keep color and shadow opacity in sync
    if (name === 'shadowColor') {
      const alpha = tinycolor(value).getAlpha() * 100;
      state.dropShadow.shadowOpacity = parseInt(alpha, 10);
    } else if (name === 'shadowOpacity') {
      const color = this.props.dropShadow.shadowColor;
      state.dropShadow.shadowColor = tinycolor(color).setAlpha(value / 100);
    }

    state.dropShadow[name] = value;

    this.props.updateGenerator(state);
  }

	handleActiveToggle(value, name) {
    this.handleChange(value, name, 'isActive');
	}

	render() {
    const dropShadowInputs = this.props.dropShadowSliders.slice();

    // Add shadow color to drop shadow inputs
    dropShadowInputs.push(
      <ColorPicker
        name="shadowColor"
        key="shadowColor"
        className="small no-margin align-right small-preview"
        color={this.props.dropShadow.shadowColor}
        onChange={this.handleDropShadowChange}
      />
    );

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
        <Sliders
          title="Drop Shadow"
          name="dropShadow"
          sliders={dropShadowInputs}
          onChange={this.handleDropShadowChange}
          onActiveToggle={this.handleActiveToggle}
          allOptional={true}
          {...this.props.dropShadow}
        />
      </div>
		);
	}
}

export default FilterInputs;