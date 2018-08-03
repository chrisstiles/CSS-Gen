import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import GradientInputs from './GradientInputs';
import GradientPresets from './GradientPresets';
import generateGradient from './generate-gradient';
import { getStateFromLocalStorage } from '../../../util/helpers';
import _ from 'underscore';

class Gradient extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = {
      palette: [
        { pos: 0.00, color: '#f1b50b' },
        { pos: 0.36, color: '#d78025' },
        { pos: 0.64, color: '#bd2c61' },
        { pos: 1.00, color: '#7e20cf' }
      ],
      type: 'linear',
      repeating: false,
      shape: 'circle',
      extendKeyword: 'none',
      position: 'center',
      positionX: 0,
      positionY: 0,
      angle: 90,
      width: 500,
      height:300
    };

    this.state = getStateFromLocalStorage(this.defaultState);

    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);
    const gradient = generateGradient(rules);

    return {
      styles: gradient.styles,
      outputCSS: gradient.css
    };
  }

  renderInputs() {
    return (
      <GradientInputs
        owner={this}
        {...this.state}
      />
    );
  }

  renderPresets(setPreset) {
    return <GradientPresets setPreset={setPreset} />; 
  }

  render() {
    const intro = <p>Create linear and radial gradients with CSS.</p>;

    return (
      <SingleWindowGenerator 
        title="CSS Gradient Generator | CSS-GEN"
        previewID="gradient-preview"
        className="gradient"
        heading="CSS Gradient Generator"
        intro={intro}
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
        renderPresets={this.renderPresets}
        hideToolbarBackground={true}
        resetStyles={this.reset}
        styles={this.state}
        generator={this}
        browserPrefixes={true}
        centerPreview={false}
        fullWidthPreview={true}
        defaultState={this.defaultState}
      />
    );
  }
}

export default Gradient;