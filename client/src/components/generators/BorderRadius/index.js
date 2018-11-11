import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import BorderRadiusInputs from './BorderRadiusInputs';
import BorderRadiusPresets from './BorderRadiusPresets';
import { getState, generateCSSString } from '../../../util/helpers';
import _ from 'underscore';

class BorderRadius extends React.Component {
  constructor(props) {
    super(props);

    this.state = getState(BorderRadius.defaultState, BorderRadius.stateTypes);

    this.previewStyles = {
      backgroundColor: '#4834D4'
    }

    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.renderPresets = this.renderPresets.bind(this);
    this.updateGenerator = this.updateGenerator.bind(this);
  }

  updateGenerator(state) {
    this.setState(state);
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
    const output = generateCSSString(css);

    // Add extra keys
    css.borderWidth = `${rules.borderWidth}px`;

    return {
      styles: css,
      output: output
    };
  }

  renderInputs() {
    return (
      <BorderRadiusInputs
        updateGenerator={this.updateGenerator}
        {...this.state}
      />
    );
  }

  renderPresets(setPreset) {
    return <BorderRadiusPresets setPreset={setPreset} />;
  }

  render() {
    const intro = <p>Use the controls on to the right to create any kind of border. Once you are done, copy your CSS from the code output box in the bottom right.</p>;
    const generatorState = _.extend({}, this.state, { css: this.generateCSS() });

    return (
      <SingleWindowGenerator 
        // Text Content
        title="CSS Border Radius Generator | CSS-GEN"
        previewID="border-radius-preview"
        className="border-radius"
        property="border-radius"
        heading="CSS Border Radius Generator"
        intro={intro}

        // Generator state
        generatorState={generatorState}
        previewStyles={this.previewStyles}
        generatorDefaultState={BorderRadius.defaultState}
        globalState={this.props.globalState}

        // Render generator components
        renderInputs={this.renderInputs}
        renderPresets={this.renderPresets}

        // Generator methods
        updateGenerator={this.updateGenerator}        
      />
    );
  }
}

export default BorderRadius;

const defaultRadius = 10;
const defaultUnits = 'px';

BorderRadius.defaultState = {
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
  borderStyle: 'none',
  borderColor: '#323232',
  borderWidth: 10,
  inset: true
};

BorderRadius.stateTypes = {
  radius: Number,
  units: String,
  topLeft: Number,
  topLeftUnits: String,
  topRight: Number,
  topRightUnits: String,
  bottomRight: Number,
  bottomRightUnits: String,
  bottomLeft: Number,
  bottomLeftUnits: String,
  borderStyle: String,
  borderColor: String,
  borderWidth: Number,
  inset: Boolean
};



