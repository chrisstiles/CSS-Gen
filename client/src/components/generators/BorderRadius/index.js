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
    const defaultUnits = 'px';

    const defaultState = {
      radius: defaultRadius,
      units: defaultUnits,
      topLeft: defaultRadius,
      topLeftUnits: defaultUnits,
      topRight: defaultRadius,
      topRightUnits: defaultUnits,
      bottomRight: defaultRadius,
      bottomRightUnits: defaultUnits,
      bottomLeft: defaultRadius,
      bottomLeftUnits: defaultUnits,
      backgroundColor: 'rgba(72, 52, 212, 1)',
      borderStyle: 'none',
      borderColor: '#323232',
      borderWidth: 10,
      inset: true,
      width:300,
      height:250
    };

    if (props.previousState) {
      this.state = _.extend(defaultState, props.previousState);
    } else {
      this.state = defaultState;
    }

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
      css.borderRadius = `${rules.radius}${rules.units}`;
    } else {
      // Return shorthand CSS if some corners are equal
      const topLeftBottomRightEqual = rules.topLeft === rules.bottomRight;
      const topRightBottomLeftEqual = rules.topRight === rules.bottomLeft;

      var borderRadius;
      if (topLeftBottomRightEqual && topRightBottomLeftEqual) {
        borderRadius = `${rules.topLeft}${rules.topLeftUnits} ${rules.topRight}${rules.topRightUnits}`;
      } else if (topRightBottomLeftEqual) {
        borderRadius = `${rules.topLeft}${rules.topLeftUnits} ${rules.topRight}${rules.topRightUnits} ${rules.bottomRight}${rules.bottomRightUnits}`;
      } else {
        borderRadius = `${rules.topLeft}${rules.topLeftUnits} ${rules.topRight}${rules.topRightUnits} ${rules.bottomRight}${rules.bottomRightUnits} ${rules.bottomLeft}${rules.bottomLeftUnits}`;
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
        owner={this}
        {...this.state}
      />
    );
  }

  renderPresets(setPreset) {
    return <BorderRadiusPresets setPreset={setPreset} />;
  }

  render() {
    const intro = <p>Use the controls on to the right to create any kind of border. Once you are done, copy your CSS from the code output box in the bottom right.</p>;

    return (
      <SingleWindowGenerator 
        title="CSS Border Radius Generator | CSS-GEN"
        previewID="border-radius-preview"
        className="border-radius"
        property="border-radius"
        heading="CSS Border Radius Generator"
        intro={intro}
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
        renderPresets={this.renderPresets}
        styles={this.state}
        generator={this}
      />
    );
  }
}

export default BorderRadius;




