import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import BorderRadiusInputs from './BorderRadiusInputs';
import BorderRadiusPresets from './BorderRadiusPresets';
import { generateCSSString } from '../../../util/helpers';
import _ from 'underscore';

class BorderRadius extends React.Component {
  constructor(props) {
    super(props);

    const defaultRadius = 10;

    this.state = {
      radius: defaultRadius,
      topLeft: defaultRadius,
      topRight: defaultRadius,
      bottomRight: defaultRadius,
      bottomLeft: defaultRadius,
      backgroundColor: 'rgba(72, 52, 212, 1)',
      borderStyle: 'none',
      borderColor: '#323232',
      borderWidth: 10,
      inset: true,
      width:300,
      height:300
    };

    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.renderPresets = this.renderPresets.bind(this);
  }

  generateCSS(styles = {}) {
    const css = {}; // The object we will return
    const rules = _.extend({}, this.state, styles);
    
    const radii = [rules.topLeft, rules.topRight, rules.bottomRight, rules.bottomLeft];
    var allEqual = true;

    radii.forEach(element => {
      if (rules.radius !== element) {
        allEqual = false;
      }
    });

    if (allEqual) {
      // All corners are equal
      css.borderRadius = `${rules.radius}px`;
    } else {
      // Return shorthand CSS if some corners are equal
      const topLeftBottomRightEqual = rules.topLeft === rules.bottomRight;
      const topRightBottomLeftEqual = rules.topRight === rules.bottomLeft;

      var borderRadius;
      if (topLeftBottomRightEqual && topRightBottomLeftEqual) {
        borderRadius = `${rules.topLeft}px ${rules.topRight}px`;
      } else if (topRightBottomLeftEqual) {
        borderRadius = `${rules.topLeft}px ${rules.topRight}px ${rules.bottomRight}px`;
      } else {
        borderRadius = `${rules.topLeft}px ${rules.topRight}px ${rules.bottomRight}px ${rules.bottomLeft}px`;
      }

      css.borderRadius = borderRadius;
    }

    // Add border to preview if necessary
    if (rules.borderStyle !== 'none') {
      css.border = `${rules.borderWidth}px ${rules.borderStyle} ${rules.borderColor}`;

      // Add box sizing for inset border
      if (!rules.inset) {
        css.boxSizing = 'content-box';
      } else {
        css.boxSizing = 'border-box';
      }
    }

    // Add output string
    const outputCSS = generateCSSString(css);

    // Add extra keys
    css.borderWidth = `${rules.borderWidth}px`;

    return {
      styles: css,
      outputCSS: outputCSS
    };
  }

  renderInputs() {
    return (
      <BorderRadiusInputs
        styles={this.state}
        owner={this}
      />
    );
  }

  renderPresets(setPreset) {
    return <BorderRadiusPresets setPreset={setPreset} />;
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
        renderPresets={this.renderPresets}
        resetStyles={this.reset}
        styles={this.state}
        owner={this}
      />
    );
  }
}

export default BorderRadius;




