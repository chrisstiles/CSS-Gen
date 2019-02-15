import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import FlexboxPreview from './FlexboxPreview';
import FlexboxInputs from './FlexboxInputs';
// import FlexboxOutput from './FlexboxOutput';
import FlexboxBottom from './FlexboxBottom';
// import { getState } from '../../../util/helpers';
// import Toggle from '../../input/Toggle';
// import ColorPicker from '../../input/ColorPicker';
import _ from 'underscore';

import Generator from './Generator';
import Header from '../../Header';

import { getState } from '../../../util/helpers';

// **order
// flex-grow
// flex-shrink
// flex-basis
// **flex
// align-self

class Flexbox extends React.Component {
  constructor(props) {
    super(props);

    this.state = getState(Flexbox.defaultState, Flexbox.stateTypes);

    // Add unique keys to each child element
    _.map(this.state.childElements, child => {
      child.id = _.uniqueId('child-');
    });

    // Restrict number of child elements
    this.maxChildElements = 50;

    if (this.state.childElements.length > this.maxChildElements) {
      this.state.childElements = Flexbox.defaultState.childElements.slice();
    }

    this.state.canAddChildElement = this.state.childElements.length < this.maxChildElements;
  }

  updateGenerator = (state, name) => {
    if (name) {
      const newState = {};
      newState[name] = state;

      this.setState(newState);
    } else {
      const childElements = state.childElements !== undefined ? state.childElements : this.state.childElements;
      state.canAddChildElement = childElements.length < this.maxChildElements;

      this.setState(state);
    }
  }

  addChildElement = () => {
    if (this.state.canAddChildElement) {
      const canAddChildElement = this.state.childElements.length + 1 < this.maxChildElements;
      const child = { id: _.uniqueId('child-') };
      const childElements = this.state.childElements.slice();
      childElements.push(child);

      this.setState({ childElements, canAddChildElement });
    }
  }

  generate = () => {
    const css = `
      .flex-container {
        background-color:red;
      }
    `;

    const html = `
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
      <div class="flex-container">
        Testing
      </div>
    `;

    return [
      { language: 'css', code: css },
      { language: 'html', code: html }
    ];
  }

  render() {
    const { 
      showAddItemButtons,
      fullHeightContainer,
      canvasBackgroundColor 
    } = this.props;
    const output = this.generate();
    const props = _.extend({}, this.state, {
      updateGenerator: this.updateGenerator,
      addChildElement: this.addChildElement
    });

    return (
      <Generator 
        title="CSS Flexbox Generator" 
        className="flexbox-generator"
        generatorState={this.state}
        globalState={this.props.globalState}
      >
        <Header>
          <h1>CSS Flexbox Generator</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
        </Header>
        <FlexboxInputs {...props} />
        <FlexboxPreview 
          canvasBackgroundColor={canvasBackgroundColor}
          {...props}
        />
        <FlexboxBottom
          output={output}
          showAddItemButtons={showAddItemButtons}
          fullHeightContainer={fullHeightContainer}
          updateGenerator={this.updateGenerator}
        />
      </Generator>
    );
  }
}

export default Flexbox;

Flexbox.defaultState = {
  childElements: [{ id: 'child-1' }, { id: 'child-2' }, { id: 'child-3' }],
  containerStyles: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    alignContent: 'flex-start'
  },
  itemStyles: {
    flexGrow: 1,
    flexShrink: 0,
    alignSelf: 'auto'
  },
  selectedIndexes: [],
  mostRecentIndex: 0,
  showAddItemButton: true,
  fullHeightContainer: true,
  canvasBackgroundColor: 'transparent'
};

Flexbox.stateTypes = {
  childElements: [{ id: String }],
  containerStyles: {
    display: String,
    flexDirection: String,
    flexWrap: String,
    justifyContent: String,
    alignItems: String,
    alignContent: String
  },
  itemStyles: {
    flexGrow: Number,
    flexShrink: Number,
    alignSelf: String
  },
  selectedIndexes: [Number],
  mostRecentIndex: Number,
  showAddItemButton: Boolean,
  fullHeightContainer: Boolean,
  canvasBackgroundColor: String
};