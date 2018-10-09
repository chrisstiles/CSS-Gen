import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import { getState } from '../../../util/helpers';
import _ from 'underscore';

class Flexbox extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = {
      children: [{ test: 'hello' }]
    };

    this.stateTypes = {
      children: [{ test: String }]
    };

    this.state = getState(this.defaultState, this.stateTypes);

    this.updateGenerator = this.updateGenerator.bind(this);
    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
  }

  updateGenerator(state) {
    this.setState(state);
  }

  generateCSS(styles = {}) {
    return { styles: {}, output: '' };
  }

  renderInputs() {
    return 'Testing';
  }

  renderPreview() {
    return (
      <div>
        Preview Here
      </div>
    );
  }

  render() {
    const generatorState = _.extend({}, this.state, { css: this.generateCSS() });

    return (
      <StaticWindowGenerator
        // Text Content
        title="CSS Flexbox Generator | CSS-GEN"
        previewID="flexbox-preview"
        className="flexbox"
        heading="CSS Flexbox Generator"

        // Generator state
        generatorState={generatorState}
        generatorDefaultState={this.defaultState}
        globalState={this.props.globalState}

        // Render generator components
        renderInputs={this.renderInputs}
        renderPreview={this.renderPreview}

        // Generator methods
        updateGenerator={this.updateGenerator}
      />
    );
  }
}

export default Flexbox;