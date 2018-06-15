import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import BoxShadowInputs from './BoxShadowInputs';
import { generateCSSString } from '../../../util/helpers';
import _ from 'underscore';

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
      inset: false,
      width: 300,
      height: 300
    };

    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);
    const color = rules.color === undefined ? this.state.shadowColor.rgb : rules.color.rgb;

    var boxShadow = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${rules.spreadRadius}px rgba(${color.r}, ${color.g}, ${color.b}, ${rules.shadowOpacity})`;

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
        styles={this.state}
        owner={this}
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
        resetStyles={this.reset}
        styles={this.state}
        owner={this}
      />
    );
  }
}

export default BoxShadow;