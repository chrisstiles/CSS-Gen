import React from 'react';
import createGenerator from '../create-generator';
import GradientInputs from './GradientInputs';
import GradientPresets from './GradientPresets';
import generateGradient from './generate-gradient';
import Generator from '../../Generator';
import Header from '../../Header';
import Preview from '../../Preview';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';

class Gradient extends React.Component {
  generate = () => {
    const { css, styles } = generateGradient(this.props.generatorState);

    return {
      output: {
        language: 'css',
        code: css
      },
      previewStyle: styles
    };
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

    const { width, height } = previewState;

    return (
      <Generator
        title="CSS Gradient Generator | CSS-GEN"
        className="gradient-generator"
        generatorState={generatorState}
        previewState={previewState}
        globalState={globalState}
      >
        <Header
          defaultState={defaultState}
          updateGenerator={updateGenerator}
        >
          <h1>CSS Gradient Generator</h1>
          <p>Create linear and radial gradients with CSS.</p>
        </Header>
        <GradientInputs
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
            previewState={{ width, height }}
            canvasColor={previewState.canvasColor}
          />
          <GradientPresets setPreset={updateGenerator} />
        </BottomContent>
      </Generator>
    );
  }
}

const defaultState = {
  palette: [
    { pos: 0.00, color: '#f1b50b' },
    { pos: 0.36, color: '#d78025' },
    { pos: 0.64, color: '#bd2c61' },
    { pos: 1.00, color: '#7e20cf' }
  ],
  type: 'linear',
  repeating: false,
  shape: 'circle',
  extendKeyword: 'none',
  position: 'center',
  offsetX: 0,
  offsetY: 0,
  angle: 90
};

const stateTypes = {
  palette: [
    { pos: Number, color: String }
  ],
  type: String,
  repeating: Boolean,
  shape: String,
  extendKeyword: String,
  position: String,
  offsetX: Number,
  offsetY: Number,
  angle: Number
};

export default createGenerator(Gradient, defaultState, stateTypes, {
  isDefaultPreview: true
});