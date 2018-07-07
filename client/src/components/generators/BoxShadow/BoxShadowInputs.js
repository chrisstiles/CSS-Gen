import React from 'react';
import Sliders from '../../input/Sliders';
import Toggle from '../../input/Toggle';
import ColorPicker from '../../input/ColorPicker';

const sliders = [
  { title: 'Horizontal Shift', name: 'horizontalShift', min: -200, max: 200 },
  { title: 'Vertical Shift', name: 'verticalShift', min: -200, max: 200 },
  { title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100 },
  { title: 'Spread Radius', name: 'spreadRadius', min: 0, max: 100 },
  { title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 1, step: .01 }
];

class BoxShadowInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, name) {
    const state = {};
    state[name] = value;

    this.props.owner.setState(state);
  }

  render() {
    return (
      <div>
        <div className="row">
          <div className="field-wrapper left">
            <label className="title">Shadow Color</label>
            <ColorPicker
              color={this.props.styles.shadowColor}
              disableAlpha={true}
              onChange={this.handleChange}
              name="shadowColor"
              returnColorObject={true}
            />
          </div>

          <div className="field-wrapper right">
            <Toggle
              onChange={this.handleChange}
              checked={this.props.styles.inset}
              label="Inset"
              className="left"
              name="inset"
            />
          </div>
        </div>
        <Sliders
          sliders={sliders}
          onChange={this.handleChange}
          {...this.props.styles}
        />
      </div>
    );
  }
}

export default BoxShadowInputs;