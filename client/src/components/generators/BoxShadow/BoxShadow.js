import React from 'react';
// import SingleWindowGenerator from '../types/SingleWindowGenerator';
import BoxShadowInputs from './BoxShadowInputs';
import { generateCSSString, hexOrRgba, getState } from '../../../util/helpers';

import Generator from '../../Generator';
import Header from '../../Header';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import tinycolor from 'tinycolor2';

class BoxShadow extends React.Component {
  constructor(props) {
    super(props);

    this.state = getState(BoxShadow.defaultState, BoxShadow.stateTypes);
  }

  updateGenerator = (state) => {
    this.setState(state);
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

    return {
      language: 'css',
      code: boxShadow
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
    // const generatorState = extend({}, this.state, { css: this.generateCSS() });
    const output = this.generate();

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
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
        </Header>
        <BoxShadowInputs 
          updateGenerator={this.updateGenerator}
          {...this.state} 
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
  inset: false,
  canvasColor: 'red'
};

BoxShadow.stateTypes = {
  horizontalShift: Number,
  verticalShift: Number,
  blurRadius: Number,
  spreadRadius: Number,
  shadowOpacity: Number,
  shadowColor: String,
  inset: Boolean,
  canvasColor: String
};