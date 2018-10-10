import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import FlexboxPreview from './FlexboxPreview';
import FlexboxInputs from './FlexboxInputs';
import { getState } from '../../../util/helpers';
import _ from 'underscore';

class Flexbox extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = {
      childElements: [{ text: 'hello' }, { text: 'hello2' }]
    };

    this.stateTypes = {
      childElements: [{ text: String }]
    };

    this.state = getState(this.defaultState, this.stateTypes);

    // Add unique keys to each child element
    _.map(this.state.childElements, child => {
      child.id = _.uniqueId('child-');
    });

    // The index of the selected child element
    this.state.selectedIndex = null;

    this.updateGenerator = this.updateGenerator.bind(this);
    this.generateCSS = this.generateCSS.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
  }

  updateGenerator(state) {
    this.setState(state);
  }

  generateCSS(styles = {}) {
    return { styles: {}, output: '' };
  }

  renderInputs() {
    const { childElements, selectedIndex } = this.state;
    const currentChild = selectedIndex === null ? null : childElements[selectedIndex];

    return (
      <FlexboxInputs
        updateGenerator={this.updateGenerator}
        currentChild={currentChild}
        {...this.state}
      />
    );
  }

  renderPreview(style) {
    return (
      <FlexboxPreview
        style={style}
        childElements={this.state.childElements}
        selectedIndex={this.state.selectedIndex}
        updateGenerator={this.updateGenerator}
      />
    );
  }

  render() {
    const generatorState = _.extend({}, this.state, { css: this.generateCSS() });

    return (
      <StaticWindowGenerator
        // Text Content
        title="CSS Flexbox Generator | CSS-GEN"
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