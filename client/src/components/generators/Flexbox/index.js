import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import FlexboxPreview from './FlexboxPreview';
import FlexboxInputs from './FlexboxInputs';
import FlexboxOutput from './FlexboxOutput';
import FlexBoxPresets from './FlexBoxPresets';
// import { getState } from '../../../util/helpers';
import Toggle from '../../input/Toggle';
import ColorPicker from '../../input/ColorPicker';
import _ from 'underscore';

import Generator from './Generator';
import Header from '../../Header';
import BottomContent from '../../BottomContent';

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

  updateGenerator = (state) => {
    const childElements = state.childElements !== undefined ? state.childElements : this.state.childElements;
    state.canAddChildElement = childElements.length < this.maxChildElements;

    this.setState(state);
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

  generateCSS = (styles = {}) => {
    const output = `
      .flex-container {
        background-color:red;
      }
    `;
    return { styles: {}, output };
  }

  handlePreviewUpdate = (value, name) => {
    const state = {};
    state[name] = value
    this.setState(state);
  }

  // renderInputs = () => {
  //   return (
  //     <FlexboxInputs
  //       updateGenerator={this.updateGenerator}
  //       addChildElement={this.addChildElement}
  //       {...this.state}
  //     />
  //   );
  // }

  renderOutput = (previewCSS) => {
    return (
      <FlexboxOutput
        outputCSS={this.generatorState.css.output}
        globalState={this.props.globalState}
        previewCSS={previewCSS}
      />
    );
  }

  renderToolbarItems = () => {
    const { showAddItemButton, fullHeightContainer, containerBackgroundColor } = this.state;

    return (
      <div>
        <div className="item input border">
          <Toggle
            name="showAddItemButton"
            onChange={this.handlePreviewUpdate}
            label="Add Button"
            checked={showAddItemButton}
          />
        </div>
        <div className="item input border">
          <Toggle
            name="fullHeightContainer"
            onChange={this.handlePreviewUpdate}
            label="Full Height"
            checked={fullHeightContainer}
          />
        </div>
        <div className="item input">
          <ColorPicker
            label="Background"
            name="containerBackgroundColor"
            color={containerBackgroundColor}
            isFixed={true}
            onChange={this.handlePreviewUpdate}
          />
        </div>	
      </div>
    );
  }

  // renderPreview = () => {
  //   const containerStyles = _.extend({}, style, this.state.containerStyles);
  //   const itemStyles = _.extend({}, style, this.state.itemStyles);
  //   const { 
  //     childElements, 
  //     selectedIndexes, 
  //     showAddItemButton,
  //     fullHeightContainer,
  //     containerBackgroundColor, 
  //     mostRecentIndex, 
  //     canAddChildElement
  //   } = this.state;

  //   return (
  //     <FlexboxPreview
  //       containerStyles={containerStyles}
  //       containerBackgroundColor={containerBackgroundColor}
  //       itemStyles={itemStyles}
  //       childElements={childElements}
  //       selectedIndexes={selectedIndexes}
  //       showAddItemButton={showAddItemButton}
  //       fullHeightContainer={fullHeightContainer}
  //       mostRecentIndex={mostRecentIndex}
  //       canAddChildElement={canAddChildElement}
  //       updateGenerator={this.updateGenerator}
  //       addChildElement={this.addChildElement}
  //     />
  //   );
  // }

  render() {
    // const generatorState = _.extend({}, this.state, { css: this.generateCSS() });
    // this.generatorState = _.extend({}, this.state, { css: this.generateCSS() });
    // const containerStyles = _.extend({}, style, this.state.containerStyles);
    // const itemStyles = _.extend({}, style, this.state.itemStyles);
    // const {
    //   childElements,
    //   selectedIndexes,
    //   showAddItemButton,
    //   fullHeightContainer,
    //   containerBackgroundColor,
    //   mostRecentIndex,
    //   canAddChildElement
    // } = this.state;

    const props = _.extend({}, this.state, {
      updateGenerator: this.updateGenerator,
      addChildElement: this.addChildElement
    });

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

    const css = this.generateCSS();

    const output = [
      { language: 'css', code: css.output },
      { language: 'html', code: html }
    ];

    return (
      <Generator 
        title="CSS Flexbox Generator" 
        className="flexbox-generator"
      >
        <Header>
          <h1>CSS Flexbox Generator</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
        </Header>
        <FlexboxInputs {...props} />
        <FlexboxPreview {...props} />
        <BottomContent output={output}>
          <FlexBoxPresets />
        </BottomContent>
      </Generator>
    );

    // return (
      // <StaticWindowGenerator
      //   // Text Content
      //   title="CSS Flexbox Generator | CSS-GEN"
      //   className="flexbox"
      //   heading="CSS Flexbox Generator"

      //   // Generator settings
      //   multipleOutputs={true}

      //   // Generator state
      //   generatorState={this.generatorState}
      //   generatorDefaultState={Flexbox.defaultState}
      //   globalState={this.props.globalState}

      //   // Render generator components
      //   renderInputs={this.renderInputs}
      //   renderToolbarItems={this.renderToolbarItems}
      //   renderPreview={this.renderPreview}
      //   renderOutput={this.renderOutput}

      //   // Generator methods
      //   updateGenerator={this.updateGenerator}
      // />
    // );
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
  containerBackgroundColor: 'transparent'
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
  containerBackgroundColor: String
};