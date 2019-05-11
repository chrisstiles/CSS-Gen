import React from 'react';
import createGenerator from '../create-generator';
import GradientInputs from './GradientInputs';
// import GradientPresets from './GradientPresets';
import generateGradient from './generate-gradient';
import Generator from '../../Generator';
import Header from '../../Header';
import GeneratorContent from '../../GeneratorContent';
import Preview from '../../Preview';
import Toolbar from '../../Toolbar';

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
      updatePreview,
      resetGenerator
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
        <GradientInputs
          updateGenerator={updateGenerator}
          {...generatorState}
        />
        <GeneratorContent
          output={output}
          canvasColor={previewState.canvasColor}
          globalState={globalState}
          updatePreview={updatePreview}
        >
          <Header>
            <h1>CSS Gradient Generator</h1>
            <p>Create linear and radial gradients with CSS.</p>
          </Header>
          <Toolbar
            previewState={{ width, height }}
            updatePreview={updatePreview}
            resetGenerator={resetGenerator}
          />
          <Preview
            canvasColor={previewState.canvasColor}
            previewState={previewState}
            resetCount={generatorState.resetCount}
            updatePreview={updatePreview}
            useBackgroundImage={true}
            style={previewStyle}
          />
        </GeneratorContent>
      </Generator>
    );
  }
}

const defaultState = {
  palette: [
    { id: 1, pos: 0.00, color: '#f1b50b' },
    { id: 2, pos: 0.36, color: '#d78025' },
    { id: 3, pos: 0.64, color: '#bd2c61' },
    { id: 4, pos: 1.00, color: '#7e20cf' }
  ],
  activeId: 1,
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
    { id: Number, pos: Number, color: String }
  ],
  activeId: Number,
  pointX: null,
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