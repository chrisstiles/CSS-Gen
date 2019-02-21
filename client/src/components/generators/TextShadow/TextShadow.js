import React from 'react';
import createGenerator from '../create-generator';
import TextShadowInputs from './TextShadowInputs';
import TextShadowPreview from './TextShadowPreview';

import Generator from '../../Generator';
import Header from '../../Header';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';

import { generateCSSString, hexOrRgba } from '../../../util/helpers';
import _ from 'underscore';

const defaultFont = 'Montserrat';

class TextShadow extends React.Component {
  // componentDidMount() {
  //   // Load font if default is not selected
  //   if (this.state.googleFont !== defaultFont) {
  //     this.state.fontLoaded = false;
  //   } else {
  //     this.state.fontLoaded = true;
  //   }
  // }

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

  // renderInputs = () => {
  //   return (
  //     <TextShadowInputs
  //       updateGenerator={this.updateGenerator}
  //       {...this.state}
  //     />
  //   );
  // }

  // renderPreview = (style) => {
  //   return (
  //     <TextShadowPreview
  //       value={this.state.text}
  //       name="text"
  //       style={style}
  //       placeholder="Click here to enter text"
  //       onChange={this.updateGenerator}
  //     />
  //   );
  // }

  render() {
    const { output, previewStyle } = this.generate();

    const {
      globalState,
      generatorState,
      previewState,
      updateGenerator,
      updatePreview
    } = this.props;

    return (
      <Generator
        title="CSS Text Shadow Generator"
        className="text-shadow-generator"
        generatorState={generatorState}
        previewState={previewState}
        globalState={globalState}
      >
        <Header
          defaultState={defaultState}
          updateGenerator={updateGenerator}
        >
          <h1>CSS Triangle Generator</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
        </Header>
        <TextShadowInputs
          updateGenerator={updateGenerator}
          {...generatorState}
        />
        <TextShadowPreview
          value={generatorState.text}
          name="text"
          style={previewStyle}
          canvasColor={previewState.canvasColor}
          placeholder="Click here to enter text"
          updateGenerator={updateGenerator}
        />
        <BottomContent output={output}>
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
  shadowOpacity: 15,
  shadowColor: '#000',
  fontColor: '#000',
  fontLoaded: true
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
  fontLoaded: Boolean
};

export default createGenerator(TextShadow, defaultState, stateTypes);