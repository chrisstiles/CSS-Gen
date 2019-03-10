import React from 'react'
import createGenerator from '../create-generator';
import FlexboxPreview from './FlexboxPreview';
import FlexboxInputs from './FlexboxInputs';
import FlexboxBottom from './FlexboxBottom';
import Generator from '../../Generator';
import Header from '../../Header';
import { map, uniqueId, extend } from 'underscore';

const maxChildElements = 50;

class Flexbox extends React.Component {
  componentDidUpdate(prevProps) {
    const { childElements: prevChildElements } = prevProps.generatorState;
    const { childElements } = this.props.generatorState;
    
    if (childElements.length !== prevChildElements.length) {
      const canAddChildElement = childElements.length <= maxChildElements;
      this.props.updateGenerator({ canAddChildElement });
    }
  }

  addChildElement = () => {
    const { 
      canAddChildElement: _canAddChildElement, 
      childElements: _childElements
    } = this.props.generatorState;

    if (_canAddChildElement) {
      const canAddChildElement = _childElements.length + 1 < maxChildElements;
      const child = { id: uniqueId('child-') };
      const childElements = _childElements.slice();
      childElements.push(child);
      this.props.updateGenerator({ childElements, canAddChildElement });
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
      globalState,
      generatorState,
      previewState,
      updateGenerator,
      updatePreview,
      resetGenerator
    } = this.props;

    const output = this.generate();
    const props = extend({}, { ...generatorState }, {
      updateGenerator,
      addChildElement: this.addChildElement
    });

    const {
      showAddButton,
      isFullHeight,
      canvasColor
    } = previewState;

    return (
      <Generator 
        title="CSS Flexbox Generator" 
        className="flexbox-generator"
        generatorState={generatorState}
        previewState={previewState}
        globalState={globalState}
      >
        <Header resetGenerator={resetGenerator}>
          <h1>CSS Flexbox Generator</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
        </Header>
        <FlexboxInputs {...props} />
        <FlexboxPreview 
          canvasColor={canvasColor}
          showAddButton={showAddButton}
          isFullHeight={isFullHeight}
          {...props}
        />
        <FlexboxBottom
          output={output}
          showAddButton={showAddButton}
          isFullHeight={isFullHeight}
          canvasColor={canvasColor}
          updatePreview={updatePreview}
          updateGenerator={updateGenerator}
        />
      </Generator>
    );
  }
}

const defaultState = {
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
  previewState: {
    canvasColor: '#fdfdfd',
    showAddButton: true,
    isFullHeight: true
  }
};

const stateTypes = {
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
  previewState: {
    canvasColor: String,
    showAddButton: Boolean,
    isFullHeight: Boolean
  }
};

// Add unique keys to each child element
function addUniqueIds(state) {
  state.childElements = state.childElements || [];

  map(state.childElements, child => {
    child.id = uniqueId('child-');
  });

  if (state.childElements.length > maxChildElements) {
    state.childElements = defaultState.childElements.slice();
  }

  state.canAddChildElement = state.childElements.length < maxChildElements;

  return state;
}

export default createGenerator(Flexbox, defaultState, stateTypes, {
  mutateInitialState: addUniqueIds
});