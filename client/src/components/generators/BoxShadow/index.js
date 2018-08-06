import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import BoxShadowInputs from './BoxShadowInputs';
import { generateCSSString, hexOrRgba, getDefaultState, getPersistedState } from '../../../util/helpers';
import _ from 'underscore';
import tinycolor from 'tinycolor2';

class BoxShadow extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = getDefaultState({
      horizontalShift: 0,
      verticalShift: 12,
      blurRadius: 40,
      spreadRadius: 0,
      shadowOpacity: 0.15,
      shadowColor: '#000',
      inset: false
    });

    this.state = getPersistedState(this.defaultState);

    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);

    // Create tiny color with correct alpha
    var color = rules.color === undefined ? this.state.shadowColor : rules.color;
    color = tinycolor(color).setAlpha(rules.shadowOpacity);

    var boxShadow = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${rules.spreadRadius}px ${hexOrRgba(color)}`;

    if ((rules.inset !== undefined && rules.inset) || (rules.inset === undefined && this.state.inset)) {
      boxShadow = `inset ${boxShadow}`;
    }

    const css = { boxShadow };

    return {
      styles: css,
      outputCSS: generateCSSString(css)
    };
  }

  renderInputs() {
    return (
      <BoxShadowInputs
        owner={this}
        {...this.state}
      />
    );
  }

  render() {
    return (
      <SingleWindowGenerator 
        title="CSS Box Shadow Generator | CSS-GEN"
        previewID="box-shadow-preview"
        className="box-shadow"
        heading="CSS Box Shadow Generator"
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
        styles={this.state}
        generator={this}
        defaultState={this.defaultState}
        globalState={this.props.globalState}
      />
    );
  }
}

export default BoxShadow;