import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import GradientInputs from './GradientInputs';
import GradientPresets from './GradientPresets';
import generateGradient from './generate-gradient';
import { getPersistedState } from '../../../util/helpers';
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
      angle: 90
    };

    this.state = getPersistedState(this.defaultState);

    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.updateGenerator = this.updateGenerator.bind(this);
  }

  updateGenerator(state) {
    this.setState(state);
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);
    const gradient = generateGradient(rules);

    return {
      styles: gradient.styles,
      output: gradient.css
    };
  }

  renderInputs() {
    return (
      <GradientInputs
        updateGenerator={this.updateGenerator}
        {...this.state}
      />
    );
  }

  renderPresets(setPreset) {
    return <GradientPresets setPreset={setPreset} />; 
  }

  render() {
    const intro = <p>Create linear and radial gradients with CSS.</p>;
    const generatorState = _.extend({}, this.state, { css: this.generateCSS() });

    return (
      <SingleWindowGenerator
        // Text content
        title="CSS Gradient Generator | CSS-GEN"
        previewID="gradient-preview"
        className="gradient"
        heading="CSS Gradient Generator"
        intro={intro}

        // Generator settings
        hideToolbarBackground={true}
        fullWidthPreview={true}
        userImageAsBackground={true}

        // Render generator components
        renderInputs={this.renderInputs}
        renderPresets={this.renderPresets}

        // Generator state
        generatorState={generatorState}
        generatorDefaultState={this.defaultState}
        globalState={this.props.globalState}

        // Generator methods
        updateGenerator={this.updateGenerator}
      />
    );
  }
}

export default Gradient;