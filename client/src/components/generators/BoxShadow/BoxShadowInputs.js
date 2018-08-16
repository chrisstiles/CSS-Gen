import React from 'react';
import Sliders from '../../input/Sliders';
import Toggle from '../../input/Toggle';
import ColorPicker from '../../input/ColorPicker';

const sliders = [
  { title: 'Horizontal Shift', name: 'horizontalShift', min: -200, max: 200, appendString: 'px' },
  { title: 'Vertical Shift', name: 'verticalShift', min: -200, max: 200, appendString: 'px' },
  { title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100, appendString: 'px' },
  { title: 'Spread Radius', name: 'spreadRadius', min: -100, max: 100, appendString: 'px' },
  { title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 100, appendString: '%' }
];

class BoxShadowInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, name) {
    const state = {};
    state[name] = value;

    this.props.updateGenerator(state);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="field-wrapper left">
            <label className="title">Shadow Color</label>
            <ColorPicker
              color={this.props.shadowColor}
              disableAlpha={true}
              onChange={this.handleChange}
              name="shadowColor"
            />
          </div>

          <div className="field-wrapper right">
            <Toggle
              onChange={this.handleChange}
              checked={this.props.inset}
              label="Inset"
              className="left"
              name="inset"
            />
          </div>
        </div>
        <Sliders
          sliders={sliders}
          onChange={this.handleChange}
          {...this.props}
        />
      </div>
    );
  }
}

export default BoxShadowInputs;