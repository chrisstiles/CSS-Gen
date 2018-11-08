import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import FlexboxPreview from './FlexboxPreview';
import FlexboxInputs from './FlexboxInputs';
import { getState } from '../../../util/helpers';
import Toggle from '../../input/Toggle';
import _ from 'underscore';

// **order
// flex-grow
// flex-shrink
// flex-basis
// **flex
// align-self

class Flexbox extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = {
      childElements: [{ text: 'hello', id: 'child-1' }, { text: 'hello2', id: 'child-2' }],
      containerStyles: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start'
      },
      showAddItemButton: true
    };

    this.stateTypes = {
      childElements: [{ text: String }],
      containerStyles: {
        flexDirection: String,
        flexWrap: String,
        justifyContent: String,
        alignItems: String,
        alignContent: String
      },
      showAddItemButton: Boolean
    };

    this.state = getState(this.defaultState, this.stateTypes);

    // Add unique keys to each child element
    _.map(this.state.childElements, child => {
      child.id = _.uniqueId('child-');
    });

    // The index of the selected child element
    this.state.selectedIndex = null;

    this.updateGenerator = this.updateGenerator.bind(this);
    this.addChildElement = this.addChildElement.bind(this);
    this.generateCSS = this.generateCSS.bind(this);
    this.toggleAddItemButton = this.toggleAddItemButton.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.renderToolbarItems = this.renderToolbarItems.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
  }

  updateGenerator(state) {
    this.setState(state);
  }

  addChildElement() {
    const child = { id: _.uniqueId('child-') };
    const childElements = this.state.childElements.slice();
    childElements.push(child);

    this.setState({ childElements });
  }

  generateCSS(styles = {}) {
    return { styles: {}, output: '' };
  }

  toggleAddItemButton(showAddItemButton) {
    this.setState({ showAddItemButton });
  }

  renderInputs() {
    const { childElements, selectedIndex } = this.state;
    const currentChild = selectedIndex === null ? null : childElements[selectedIndex];

    return (
      <FlexboxInputs
        updateGenerator={this.updateGenerator}
        addChildElement={this.addChildElement}
        currentChild={currentChild}
        {...this.state}
      />
    );
  }

  renderToolbarItems() {
    return (
      <div className="item input border">
        <Toggle
          name="showAddItemButton"
          onChange={this.toggleAddItemButton}
          label="Show Button"
          checked={this.state.showAddItemButton}
        />
      </div>
    );
  }

  renderPreview(style) {
    const containerStyles = _.extend({}, style, this.state.containerStyles);
    const { childElements, selectedIndex, showAddItemButton } = this.state;

    return (
      <FlexboxPreview
        containerStyles={containerStyles}
        childElements={childElements}
        selectedIndex={selectedIndex}
        showAddItemButton={showAddItemButton}
        updateGenerator={this.updateGenerator}
        addChildElement={this.addChildElement}
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
        renderToolbarItems={this.renderToolbarItems}
        renderPreview={this.renderPreview}

        // Generator methods
        updateGenerator={this.updateGenerator}
      />
    );
  }
}

export default Flexbox;