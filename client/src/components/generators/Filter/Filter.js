import React from 'react';
import createGenerator from '../create-generator';
import FilterInputs from './FilterInputs';
import Generator from '../../Generator';
import Header from '../../Header';
import GeneratorContent from '../../GeneratorContent';
import Preview from '../../Preview';
import Toolbar from '../../Toolbar';
import Tooltip from '../../Tooltip';
import tinycolor from 'tinycolor2';
import _ from 'underscore';
import waterfall from './images/waterfall.jpg';

import { generateCSSString, jsToCss, hexOrRgba } from '../../../util/helpers';

class Filter extends React.Component {
  generate = () => {
    const { generatorState } = this.props;
    const css = {};

    let filtersString = '';

    // Loop through all filters and add any that are active
    _.each(filters, (filter, name) => {
      const { value, isActive } = generatorState[name];

      if (isActive) {
        const property = jsToCss(name);
        const unit = filter.unit;
        const cssString = `${property}(${value}${unit}) `;

        // Add filter type to css rules
        filtersString += cssString;
      }
    });

    // Add drop shadow
    if (generatorState.dropShadow.isActive) {
      const { horizontalShift, verticalShift, blurRadius, shadowColor } = generatorState.dropShadow;
      filtersString += `drop-shadow(${horizontalShift}px ${verticalShift}px ${blurRadius}px ${hexOrRgba(shadowColor)})`;
    }

    css.filter = filtersString.trim();

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
      defaultState,
      updateGenerator,
      updatePreview,
      updateDefaultPreviewState,
      resetGenerator
    } = this.props;

    const { width, height } = previewState;

    return (
      <Generator
        title="CSS Filter Generator"
        className="filter-generator"
        generatorState={generatorState}
        previewState={previewState}
        globalState={globalState}
      >
        <FilterInputs
          updateGenerator={updateGenerator}
          filterSliders={filterSliders}
          dropShadowSliders={dropShadowSliders}
          {...generatorState}
        />
        <GeneratorContent
          output={output}
          canvasColor={previewState.canvasColor}
          globalState={globalState}
          updatePreview={updatePreview}
        >
          <Header>
            <h1>CSS Filter Generator</h1>
            <p>Test Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent sagittis orci ac ipsum sagittis commodo. Ut ac porta nunc. Cras diam neque, vehicula vitae diam non.</p>
          </Header>
          <Toolbar
            previewState={{ width, height }}
            updatePreview={updatePreview}
            resetGenerator={resetGenerator}
          />
          <Preview
            canvasColor={previewState.canvasColor}
            previewState={previewState}
            defaultState={defaultState}
            resetCount={generatorState.resetCount}
            updatePreview={updatePreview}
            updateDefaultPreviewState={updateDefaultPreviewState}
            style={previewStyle}
          />
        </GeneratorContent>
      </Generator>
    );
  }
}

const filters = {
  blur: { title: 'Gaussian Blur', name: 'blur', min: 0, max: 50, defaultValue: 0, unit: 'px' },
  brightness: { title: 'Brightness', name: 'brightness', min: 0, max: 500, defaultValue: 100, unit: '%' },
  contrast: { title: 'Contrast', name: 'contrast', min: 0, max: 500, defaultValue: 100, unit: '%' },
  grayscale: { title: 'Grayscale', name: 'grayscale', min: 0, max: 100, defaultValue: 0, unit: '%' },
  invert: { title: 'Invert', name: 'invert', min: 0, max: 100, defaultValue: 0, unit: '%' },
  opacity: { title: 'Opacity', name: 'opacity', min: 0, max: 100, defaultValue: 100, unit: '%' },
  saturate: { title: 'Saturation', name: 'saturate', min: 0, max: 500, defaultValue: 100, unit: '%' },
  sepia: { title: 'Sepia', name: 'sepia', min: 0, max: 100, defaultValue: 0, unit: '%' },
  hueRotate: { defaultValue: 0, slider: false, unit: 'deg' }
};

const dropShadowSliders = [
  { title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100, appendString: 'px', defaultValue: 10, className: 'small' },
  { title: 'Shift X', name: 'horizontalShift', min: -200, max: 200, appendString: 'px', defaultValue: 0, className: 'half' },
  { title: 'Shift Y', name: 'verticalShift', min: -200, max: 200, appendString: 'px', defaultValue: 20, className: 'half no-margin' },
  { title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 100, appendString: '%', defaultValue: 50, className: 'w70 small no-margin left' }
];

const filterSliders = [];

// Add basic filters that only require one slider
const defaultState = _.mapObject(filters, ({ title, name, min, max, defaultValue, unit, slider }, key) => {
  if (slider || slider === undefined) {
    const tooltip = <Tooltip />;

    filterSliders.push({ title, name, min, max, tooltip, appendString: unit });
  }

  return { value: defaultValue, isActive: false };
});

defaultState.previewState = {
  image: waterfall,
  naturalWidth: 1451,
  naturalHeight: 968
};

// Add drop shadow separately
defaultState.dropShadow = {
  isActive: false,
  shadowColor: 'rgba(0, 0, 0, 0.5)'
};

_.each(dropShadowSliders, ({ name, defaultValue }) => {
  defaultState.dropShadow[name] = defaultValue;
});

const stateTypes = {
  blur: { value: Number, isActive: Boolean },
  brightness: { value: Number, isActive: Boolean },
  contrast: { value: Number, isActive: Boolean },
  grayscale: { value: Number, isActive: Boolean },
  invert: { value: Number, isActive: Boolean },
  opacity: { value: Number, isActive: Boolean },
  saturate: { value: Number, isActive: Boolean },
  sepia: { value: Number, isActive: Boolean },
  hueRotate: { value: Number, isActive: Boolean },
  dropShadow: {
    isActive: Boolean,
    blurRadius: Number,
    horizontalShift: Number,
    verticalShift: Number,
    shadowColor: String,
    shadowOpacity: Number
  },
  previewState: {
    image: String
  }
};

function setDropShadowOpacity(state) {
  const { shadowColor, shadowOpacity } = state.dropShadow;
  state.dropShadow.shadowColor = hexOrRgba(tinycolor(shadowColor).setAlpha(shadowOpacity / 100));

  return state;
}

export default createGenerator(Filter, defaultState, stateTypes, {
  isDefaultPreview: true,
  mutateInitialState: setDropShadowOpacity
});