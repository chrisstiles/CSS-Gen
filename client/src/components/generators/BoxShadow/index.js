import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import BoxShadowInputs from './BoxShadowInputs';
import { generateCSSString, hexOrRgba, getState } from '../../../util/helpers';
import _ from 'underscore';
import tinycolor from 'tinycolor2';

class BoxShadow extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = getState(BoxShadow.defaultState, BoxShadow.stateTypes);
  }

  updateGenerator = (state) => {
    this.setState(state);
  }

  generateCSS = (styles = {}) => {
    const rules = _.extend({}, this.state, styles);

    // Create tiny color with correct alpha
    let color = rules.color === undefined ? this.state.shadowColor : rules.color;
    color = tinycolor(color).setAlpha(rules.shadowOpacity / 100);

    let boxShadow = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${rules.spreadRadius}px ${hexOrRgba(color)}`;

    if ((rules.inset !== undefined && rules.inset) || (rules.inset === undefined && this.state.inset)) {
      boxShadow = `inset ${boxShadow}`;
    }

    const css = { boxShadow };

    return {
      styles: css,
      output: generateCSSString(css)
    };
  }

  renderInputs = () => {
    return (
      <BoxShadowInputs
        updateGenerator={this.updateGenerator}
        {...this.state}
      />
    );
  }

  render() {
    const generatorState = _.extend({}, this.state, { css: this.generateCSS() });
    
    return (
      <SingleWindowGenerator
        // Text content
        title="CSS Box Shadow Generator | CSS-GEN"
        previewID="box-shadow-preview"
        className="box-shadow"
        heading="CSS Box Shadow Generator"

        // Render generator components
        renderInputs={this.renderInputs}

        // Generator state
        generatorState={generatorState}
        generatorDefaultState={BoxShadow.defaultState}
        globalState={this.props.globalState}

        // Generator methods
        updateGenerator={this.updateGenerator}
      />
    );
  }
}

export default BoxShadow;

BoxShadow.defaultState = {
  horizontalShift: 0,
  verticalShift: 12,
  blurRadius: 40,
  spreadRadius: 0,
  shadowOpacity: 15,
  shadowColor: '#000',
  inset: false
};

BoxShadow.stateTypes = {
  horizontalShift: Number,
  verticalShift: Number,
  blurRadius: Number,
  spreadRadius: Number,
  shadowOpacity: Number,
  shadowColor: String,
  inset: Boolean
};