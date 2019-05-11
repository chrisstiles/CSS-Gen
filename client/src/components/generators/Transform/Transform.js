import React from 'react'
import createGenerator from '../create-generator';
import TransformInputs from './TransformInputs';
import Generator from '../../Generator';
import Header from '../../Header';
import GeneratorContent from '../../GeneratorContent';
import Preview from '../../Preview';
import Toolbar from '../../Toolbar';

class Transform extends React.Component {
  generate = () => {
    return {
      output: {
        language: 'css',
        code: `transform: skew(10deg) translate(100px, -50px)`
      },
      previewStyle: { transform: 'skewX(15deg) translate(100px, -50px)' }
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

    const { width, height, background } = previewState;

    return (
      <Generator
        title="CSS Transform Generator"
        className="transform-generator"
        generatorState={generatorState}
        previewState={previewState}
        globalState={globalState}
      >
        <TransformInputs
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
            <h1>CSS Transform Generator</h1>
            <p>Test Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
          </Header>
          <Toolbar
            previewState={{ width, height, background }}
            updatePreview={updatePreview}
            resetGenerator={resetGenerator}
          />
          <Preview
            canvasColor={previewState.canvasColor}
            previewState={previewState}
            resetCount={generatorState.resetCount}
            updatePreview={updatePreview}
            style={previewStyle}
            useDefault={true}
          >
            <div id="transform-original" />
          </Preview>
        </GeneratorContent>
      </Generator>
    );
  }
}

const defaultState = {
  translateX: 0,
  translateY: 0,
  scaleX: 0,
  scaleY: 0,
  previewState: {
    background: '#4834D4'
  }
};

const stateTypes = {
  translateX: Number,
  translateY: Number,
  scaleX: Number,
  scaleY: Number,
  previewState: {
    background: String
  }
};

export default createGenerator(Transform, defaultState, stateTypes, {
  isDefaultPreview: true
});