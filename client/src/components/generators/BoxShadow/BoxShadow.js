import React from 'react';
import createGenerator from '../create-generator';
import BoxShadowInputs from './BoxShadowInputs';
import Generator from '../../Generator';
import Header from '../../Header';
import Preview from '../../Preview';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import tinycolor from 'tinycolor2';
import { hexOrRgba } from '../../../util/helpers';

class BoxShadow extends React.Component {
  generate = () => {
    const {
      shadowColor,
      shadowOpacity,
      horizontalShift,
      verticalShift,
      blurRadius,
      spreadRadius,
      inset
    } = this.props.generatorState;

    // Create tiny color with correct alpha
    // let color = rules.color === undefined ? this.state.shadowColor : rules.color;
    const color = tinycolor(shadowColor).setAlpha(shadowOpacity / 100);

    let boxShadow = `${horizontalShift}px ${verticalShift}px ${blurRadius}px ${spreadRadius}px ${hexOrRgba(color)}`;

    if (inset) boxShadow = `inset ${boxShadow}`;

    return {
      output: {
        language: 'css',
        code: `box-shadow: ${boxShadow};`
      },
      previewStyle: { boxShadow }
    }
  }

  render() {
    const { output, previewStyle } = this.generate();

    const { 
      globalState,
      generatorState, 
      previewState, 
      updateGenerator, 
      updatePreview
    } = this.props;

    const { width, height, background } = previewState;

    return (
      <Generator
        title="CSS Box Shadow Generator"
        className="box-shadow-generator"
        generatorState={generatorState}
        previewState={previewState}
        globalState={globalState}
      >
        <Header
          defaultState={defaultState}
          updateGenerator={updateGenerator}
        >
          <h1>CSS Box Shadow Generator</h1>
          <p>Test Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
        </Header>
        <BoxShadowInputs 
          updateGenerator={updateGenerator}
          {...generatorState} 
        />
        <Preview 
          canvasColor={previewState.canvasColor}
          previewState={previewState}
          updatePreview={updatePreview}
          style={previewStyle}
        />
        <BottomContent output={output}>
          <Settings
            updatePreview={updatePreview}
            previewState={{ width, height, background }}
            canvasColor={previewState.canvasColor}
          />
        </BottomContent>
      </Generator>
    );
  }
}

const defaultState = {
  horizontalShift: 0,
  verticalShift: 12,
  blurRadius: 40,
  spreadRadius: 0,
  shadowOpacity: 15,
  shadowColor: '#000',
  inset: false
};

const stateTypes = {
  horizontalShift: Number,
  verticalShift: Number,
  blurRadius: Number,
  spreadRadius: Number,
  shadowOpacity: Number,
  shadowColor: String,
  inset: Boolean
};

export default createGenerator(BoxShadow, defaultState, stateTypes, {
  isDefaultPreview: true
});

