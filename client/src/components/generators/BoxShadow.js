import React from 'react';
import SingleWindowGenerator from './types/SingleWindowGenerator';
import Sliders from '../input/Sliders';
import Toggle from '../input/Toggle';
import ColorPicker from '../input/ColorPicker';
import _ from 'underscore';

const sliders = [
  { title: 'Horizontal Shift', name: 'horizontalShift', min: -200, max: 200 },
  { title: 'Vertical Shift', name: 'verticalShift', min: -200, max: 200 },
  { title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100 },
  { title: 'Spread Radius', name: 'spreadRadius', min: 0, max: 100 },
  { title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 1, step: .01 }
];

class BoxShadow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      horizontalShift: 0,
      verticalShift: 12,
      blurRadius: 40,
      spreadRadius: 0,
      shadowOpacity: 0.15,
      shadowColor: {
        hex: '#000000',
        rgb: {
          r: 0,
          g: 0,
          b: 0,
          a: 1
        }
      },
      inset: false
    };

    this.generateCSS = this.generateCSS.bind(this);
    this.reset = this.reset.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleShadowColorPickerChange = this.handleShadowColorPickerChange.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);
    const color = rules.color === undefined ? this.state.shadowColor.rgb : rules.color.rgb;

    var css = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${rules.spreadRadius}px rgba(${color.r}, ${color.g}, ${color.b}, ${rules.shadowOpacity})`;

    if ((rules.inset !== undefined && rules.inset) || (rules.inset === undefined && this.state.inset)) {
      css = `inset ${css}`;
    }

    return css;
  }

  reset(state) {
    this.setState(state);
  }

  handleChange(value, name) {
    var newState = {};
    newState[name] = value;

    this.setState(newState);
  }

  handleShadowColorPickerChange(color, colorObject) {
    this.setState({ shadowColor: colorObject });
  }

  handleToggleChange(value, event) {
    const name = event.target.name;

    const state = {};
    state[name] = value;

    this.setState(state);
  }

  renderInputs() {
    return (
      <div>
        <div className="row">
          <div className="field-wrapper left">
            <label className="title">Shadow Color</label>
            <ColorPicker
              backgroundColor={this.state.shadowColor}
              disableAlpha={true}
              onChange={this.handleShadowColorPickerChange}
              ref={colorPicker => { this.shadowColorPicker = colorPicker }}
              onOpen={this.handleColorPickerOpen}
            />
          </div>

          <div className="field-wrapper right">
            <Toggle
              onChange={this.handleToggleChange}
              label="Inset"
              className="left"
              name="inset"
            />
          </div>
        </div>
        <Sliders
          sliders={sliders}
          onChange={this.handleChange}
          {...this.state}
        />
      </div>
    );
  }

  render() {
    return (
      <SingleWindowGenerator 
        title="CSS Box Shadow Generator | CSS-GEN"
        previewID="box-shadow-preview"
        className="box-shadow"
        property="box-shadow"
        heading="CSS Box Shadow Generator"
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
        resetStyles={this.reset}
        defaultPreviewSize={{ width: 300, height: 300 }}
        defaultStyles={this.state}
      />
    );
  }
}

export default BoxShadow;