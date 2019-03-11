import React from 'react';
import createGenerator from '../create-generator';
import BorderRadiusInputs from './BorderRadiusInputs';
import BorderRadiusPresets from './BorderRadiusPresets';
import Generator from '../../Generator';
import Header from '../../Header';
import GeneratorContent from '../../GeneratorContent';
import Preview from '../../Preview';
import BottomContent from '../../BottomContent';
import Settings from '../../Settings';
import { generateCSSString } from '../../../util/helpers';

const defaultRadius = 10;
const defaultUnits = 'px';

class BorderRadius extends React.Component {
  generate = () => {
    const css = {}; // The object we will return
    const {
      radius,
      units,
      topLeft,
      topLeftUnits,
      topRight,
      topRightUnits,
      bottomRight,
      bottomRightUnits,
      bottomLeft,
      bottomLeftUnits,
      borderStyle,
      borderColor,
      borderWidth,
      inset,
    } = this.props.generatorState
    
    const radii = [topLeft, topRight, bottomRight, bottomLeft];
    let allEqual = true;

    radii.forEach(element => {
      if (radius !== element) {
        allEqual = false;
      }
    });

    if (allEqual) {
      // All corners are equal
      css.borderRadius = `${radius}${units}`;
    } else {
      // Return shorthand CSS if some corners are equal
      const topLeftBottomRightEqual = topLeft === bottomRight;
      const topRightBottomLeftEqual = topRight === bottomLeft;

      let borderRadius;
      if (topLeftBottomRightEqual && topRightBottomLeftEqual) {
        borderRadius = `${topLeft}${topLeftUnits} ${topRight}${topRightUnits}`;
      } else if (topRightBottomLeftEqual) {
        borderRadius = `${topLeft}${topLeftUnits} ${topRight}${topRightUnits} ${bottomRight}${bottomRightUnits}`;
      } else {
        borderRadius = `${topLeft}${topLeftUnits} ${topRight}${topRightUnits} ${bottomRight}${bottomRightUnits} ${bottomLeft}${bottomLeftUnits}`;
      }

      css.borderRadius = borderRadius;
    }

    // Add border to preview if necessary
    if (borderStyle !== 'none') {
      css.border = `${borderWidth}px ${borderStyle} ${borderColor}`;

      // Add box sizing for inset border
      if (!inset) {
        css.boxSizing = 'content-box';
      } else {
        css.boxSizing = 'border-box';
      }
    }

    // Add output string
    const output = generateCSSString(css);

    // Add extra keys
    css.borderWidth = `${borderWidth}px`;

    return {
      output: {
        language: 'css',
        code: output
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

    const { width, height, background } = previewState;

    return (
      <Generator
        title="CSS Border Radius Generator | CSS-GEN"
        className="border-radius-generator"
        generatorState={generatorState}
        previewState={previewState}
        globalState={globalState}
      >
        <Header resetGenerator={resetGenerator}>
          <h1>CSS Border Radius Generator</h1>
          <p>Use the controls on to the right to create any kind of border. Once you are done, copy your CSS from the code output box in the bottom right.</p>
        </Header>
        <BorderRadiusInputs
          updateGenerator={updateGenerator}
          {...generatorState}
        />
        <GeneratorContent output={output}>
          <Preview
            canvasColor={previewState.canvasColor}
            previewState={previewState}
            resetCount={generatorState.resetCount}
            updatePreview={updatePreview}
            style={previewStyle}
          />
        </GeneratorContent>
        <BottomContent>
          <Settings
            updatePreview={updatePreview}
            previewState={{ width, height, background }}
            canvasColor={previewState.canvasColor}
          />
          <BorderRadiusPresets setPreset={updateGenerator} />
        </BottomContent>
      </Generator>
    );
  }
}

const defaultState = {
  radius: defaultRadius,
  units: defaultUnits,
  topLeft: defaultRadius,
  topLeftUnits: defaultUnits,
  topRight: defaultRadius,
  topRightUnits: defaultUnits,
  bottomRight: defaultRadius,
  bottomRightUnits: defaultUnits,
  bottomLeft: defaultRadius,
  bottomLeftUnits: defaultUnits,
  borderStyle: 'none',
  borderColor: '#323232',
  borderWidth: 10,
  inset: true,
  previewState: {
    background: '#4834D4'
  }
};

const stateTypes = {
  radius: Number,
  units: String,
  topLeft: Number,
  topLeftUnits: String,
  topRight: Number,
  topRightUnits: String,
  bottomRight: Number,
  bottomRightUnits: String,
  bottomLeft: Number,
  bottomLeftUnits: String,
  borderStyle: String,
  borderColor: String,
  borderWidth: Number,
  inset: Boolean,
  previewState: {
    background: String
  }
};

export default createGenerator(BorderRadius, defaultState, stateTypes, {
  isDefaultPreview: true
});



