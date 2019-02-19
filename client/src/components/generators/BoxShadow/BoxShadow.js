import React from 'react';
// import SingleWindowGenerator from '../types/SingleWindowGenerator';
import BoxShadowInputs from './BoxShadowInputs';
import { hexOrRgba, getState } from '../../../util/helpers';

import Generator from '../../Generator';
import Header from '../../Header';
import Preview from '../../Preview';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import tinycolor from 'tinycolor2';

class BoxShadow extends React.Component {
  constructor(props) {
    super(props);

    this.state = getState(BoxShadow.defaultState, BoxShadow.stateTypes, true);
  }

  updateGenerator = (state, name) => {
    if (name) {
      const newState = {};
      newState[name] = state;

      this.setState(newState);
    } else {
      this.setState(state);
    }
  }

  generate = () => {
    // const rules = extend({}, this.state);

    const {
      shadowColor,
      shadowOpacity,
      horizontalShift,
      verticalShift,
      blurRadius,
      spreadRadius,
      inset
    } = this.state;

    // Create tiny color with correct alpha
    // let color = rules.color === undefined ? this.state.shadowColor : rules.color;
    const color = tinycolor(shadowColor).setAlpha(shadowOpacity / 100);

    let boxShadow = `${horizontalShift}px ${verticalShift}px ${blurRadius}px ${spreadRadius}px ${hexOrRgba(color)}`;

    if (inset) boxShadow = `inset ${boxShadow}`;

    this.previewStyle = { boxShadow };

    return {
      language: 'css',
      code: `box-shadow: ${boxShadow};`
    };
  }

  renderInputs = () => {
    return (
      <BoxShadowInputs
        updateGenerator={this.updateGenerator}
        {...this.state}
      />
    );
  }

  render() {
    const output = this.generate();
    // TODO better generate preview styles
    return (
      <Generator
        title="CSS Box Shadow Generator"
        className="box-shadow-generator"
        generatorState={this.state}
        globalState={this.props.globalState}
      >
        <Header
          defaultState={BoxShadow.defaultState}
          updateGenerator={this.updateGenerator}
        >
          <h1>CSS Box Shadow Generator</h1>
          <p>Test Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
        </Header>
        <BoxShadowInputs 
          updateGenerator={this.updateGenerator}
          {...this.state} 
        />
        <Preview 
          canvasColor={this.state.canvasColor}
          previewState={this.state.previewState}
          updateGenerator={this.updateGenerator}
          style={this.previewStyle}
        />
        <BottomContent output={output}>
          <Settings
            updateGenerator={this.updateGenerator}
            canvasColor={this.state.canvasColor}
          />
        </BottomContent>
      </Generator>
    );
  }
}

export default BoxShadow;

BoxShadow.defaultState = {
  horizontalShift: 0,
  verticalShift: 12,
  blurRadius: 40,
  spreadRadius: 0,
  shadowOpacity: 15,
  shadowColor: '#000',
  inset: false
};

BoxShadow.stateTypes = {
  horizontalShift: Number,
  verticalShift: Number,
  blurRadius: Number,
  spreadRadius: Number,
  shadowOpacity: Number,
  shadowColor: String,
  inset: Boolean
};