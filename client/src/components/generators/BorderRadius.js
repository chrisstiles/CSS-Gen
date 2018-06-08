import React from 'react';
import SingleWindowGenerator from './types/SingleWindowGenerator';
import Sliders from '../input/Sliders';
import _ from 'underscore';

const sliders = [
  { title: 'Radius', name: 'borderRadius', min: 0, max: 200 },
];


class BorderRadius extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      borderRadius: 10,
      backgroundColor: 'red'
    };

    this.generateCSS = this.generateCSS.bind(this);
    this.reset = this.reset.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);
    const css = `${rules.borderRadius}px`;

    return css;
  }

  reset(state) {
    this.setState(state);
  }

  handleChange(cssRule, value) {
    var newState = {};
    newState[cssRule] = value;

    this.setState(newState);
  }

  renderInputs() {
    return (
      <div>
        <Sliders
          sliders={sliders}
          handleChange={this.handleChange}
          {...this.state}
        />
      </div>
    );
  }

  render() {
    return (
      <SingleWindowGenerator 
        title="CSS Border Radius Generator | CSS-GEN"
        previewID="border-radius-preview"
        className="border-radius"
        property="border-radius"
        heading="CSS Border Radius Generator"
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
        resetStyles={this.reset}
        defaultPreviewSize={{ width: 300, height: 300 }}
        defaultStyles={this.state}
      />
    );
  }
}

export default BorderRadius;




