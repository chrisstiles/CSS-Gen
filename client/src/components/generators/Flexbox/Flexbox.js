import React from 'react'
import createGenerator from '../create-generator';
import FlexboxContent from './FlexboxContent';
import FlexboxInputs from './FlexboxInputs';
import FlexboxBottom from './FlexboxBottom';
import Generator from '../../Generator';
import Header from '../../Header';
import { map, uniqueId, extend, mapObject } from 'underscore';
import { generateCSSString, clone } from '../../../util/helpers';

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
      const childElements = clone(_childElements);
      childElements.push(child);
      this.props.updateGenerator({ childElements, canAddChildElement });
    }
  }

  generate = () => {
    const {
      containerStyles,
      itemStyles,
      childElements
    } = this.props.generatorState;

    const html = [];
    const css = [];

    const { display, flexWrap, ...containerDefaults } = defaultState.containerStyles;
    css.push(generateCSSString(containerStyles, '.container', { 
      flexWrap: 'nowrap',
      ...containerDefaults 
    }));

    const itemCSS = generateCSSString(itemStyles, '.item', defaultState.itemStyles);
    if (itemCSS) css.push(itemCSS);
    
    if (childElements.length) {
      childElements.forEach((child, index) => {
        const { id, ...restStyles } = child;
        
        let hasUniqueValues = false;
        const childStyles = mapObject({ ...restStyles }, (value, key) => {
          // We only output items for individual items
          // if their values are different than the default
          const newValue = itemStyles[key] === value ? null : value;
          if (newValue) hasUniqueValues = true;
          return newValue;
        });

        if (hasUniqueValues) {
          let selector;

          if (index === 0) {
            selector = `.item:first-child`;
          } else if (index === childElements.length - 1) {
            selector = `.item:last-child`;
          } else {
            selector = `.item:nth-child(${index + 1})`;
          }
          
          css.push(generateCSSString(childStyles, selector));
        }

        html.push('  <div class="item"></div>');
      });

      html.unshift('<div class="container">');
      html.push('</div>');

    } else {
      html.push('<div class="container"></div>');
    }

    return [
      { language: 'css', code: css.join('\n') },
      { language: 'html', code: html.join('\n') }
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

    // console.log(generatorState)

    const {
      showAddButton,
      isFullHeight,
      canvasColor,
      shouldChildNumber
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
        <FlexboxContent 
          canvasColor={canvasColor}
          showAddButton={showAddButton}
          isFullHeight={isFullHeight}
          shouldChildNumber={shouldChildNumber}
          output={output}
          {...props}
        />
        <FlexboxBottom
          showAddButton={showAddButton}
          isFullHeight={isFullHeight}
          canvasColor={canvasColor}
          shouldChildNumber={shouldChildNumber}
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
    alignItems: 'stretch',
    alignContent: 'stretch'
  },
  itemStyles: {
    flexGrow: 0,
    flexShrink: 1,
    alignSelf: 'auto'
  },
  selectedIndexes: [],
  mostRecentIndex: 0,
  previewState: {
    canvasColor: '#fdfdfd',
    showAddButton: true,
    shouldChildNumber: true,
    isFullHeight: false
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
    shouldChildNumber: Boolean,
    isFullHeight: Boolean
  }
};

// Add unique keys to each child element
function addUniqueIds(state) {
  state.childElements = state.childElements ? clone(state.childElements) : [];

  map(state.childElements, child => {
    child.id = uniqueId('child-');
  });

  if (state.childElements.length > maxChildElements) {
    state.childElements = clone(defaultState.childElements);
  }

  state.canAddChildElement = state.childElements.length < maxChildElements;
  state.selectedIndexes = [];

  return state;
}

export default createGenerator(Flexbox, defaultState, stateTypes, {
  mutateInitialState: addUniqueIds
});