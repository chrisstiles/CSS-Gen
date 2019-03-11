import React from 'react';
import createGenerator from '../create-generator';
import TextShadowInputs from './TextShadowInputs';
import TextShadowPreview from './TextShadowPreview';
import Generator from '../../Generator';
import Header from '../../Header';
import GeneratorContent from '../../GeneratorContent';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import { generateCSSString, hexOrRgba } from '../../../util/helpers';

const defaultFont = 'Montserrat';

class TextShadow extends React.Component {
  generate = () => {
    const css = {};

    // Text shadow
    const { horizontalShift, verticalShift, blurRadius, shadowColor, shadowOpacity } = this.props.generatorState;
    css.textShadow = `${horizontalShift}px ${verticalShift}px ${blurRadius}px ${hexOrRgba(shadowColor, shadowOpacity / 100)}`;

    // Font settings
    const { fontColor, fontFamily, fontSize } = this.props.generatorState;

    css.color = hexOrRgba(fontColor);
    css.fontFamily = fontFamily;
    css.fontSize = `${fontSize}px`;

    // Font variants
    const { variant } = this.props.generatorState;

    // Font style
    if (variant.indexOf('italic') !== -1) {
      css.fontStyle = 'italic';
    }

    // Font weight
    let weight = variant.replace('italic', '');
    if (!weight || weight === 'regular') {
      weight = '400';
    }

    css.fontWeight = weight;

    return {
      output: {
        language: 'css',
        code: generateCSSString(css)
      },
      previewStyle: { ...css }
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

    return (
      <Generator
        title="CSS Text Shadow Generator"
        className="text-shadow-generator"
        generatorState={generatorState}
        previewState={previewState}
        globalState={globalState}
      >
        <Header resetGenerator={resetGenerator}>
          <h1>CSS Triangle Generator</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
        </Header>
        <TextShadowInputs
          updateGenerator={updateGenerator}
          {...generatorState}
        />
        <GeneratorContent output={output}>
          <TextShadowPreview
            value={generatorState.text}
            name="text"
            style={previewStyle}
            canvasColor={previewState.canvasColor}
            placeholder="Click here to enter text"
            updateGenerator={updateGenerator}
          />
        </GeneratorContent>
        <BottomContent>
          <Settings
            canvasColor={previewState.canvasColor}
            updatePreview={updatePreview}
          />
        </BottomContent>
      </Generator>
    );
  }
}

const defaultState = {
  text: 'My text here',
  fontSize: 40,
  googleFont: defaultFont,
  variantOptions: [
    '100',
    '100italic',
    '200',
    '200italic',
    '300',
    '300italic',
    'regular',
    'italic',
    '500',
    '500italic',
    '600',
    '600italic',
    '700',
    '700italic',
    '800',
    '800italic',
    '900',
    '900italic'
  ],
  variant: 'regular',
  fontFamily: `"${defaultFont}", sans-serif`,
  horizontalShift: 0,
  verticalShift: 2,
  blurRadius: 10,
  shadowOpacity: 65,
  shadowColor: '#000',
  fontColor: '#000',
  fontLoaded: true,
  previewState: { canvasColor: '#fdfdfd' }
};

const stateTypes = {
  text: String,
  fontSize: Number,
  googleFont: String,
  variantOptions: [String],
  variant: String,
  fontFamily: String,
  horizontalShift: Number,
  verticalShift: Number,
  blurRadius: Number,
  shadowOpacity: Number,
  shadowColor: String,
  fontColor: String,
  fontLoaded: Boolean,
  previewState: { canvasColor: String }
};

export default createGenerator(TextShadow, defaultState, stateTypes);