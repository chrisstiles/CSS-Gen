import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import FilterInputs from './FilterInputs';
import { getPersistedState, generateCSSString, jsToCss, hexOrRgba } from '../../../util/helpers';
import tinycolor from 'tinycolor2';
import _ from 'underscore';

// Load default background images
import waterfall from './images/waterfall.jpg';

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

class Filter extends React.Component {
	constructor(props) {
		super(props);

		// Add basic filters that only require one slider
		this.filterSliders = [];

		this.defaultState = _.mapObject(filters, ({ title, name, min, max, defaultValue, unit, slider }, key) => {

			if (slider || slider === undefined) {
				this.filterSliders.push({ title, name, min, max, appendString: unit });
			}
		
			return { value: defaultValue, isActive: false };
		})

		// Add drop shadow separately
		this.defaultState.dropShadow = {
			isActive: false,
			shadowColor: '#000'
		};

		_.each(dropShadowSliders, ({ name, defaultValue }) => {
			this.defaultState.dropShadow[name] = defaultValue;
		});

		this.previewStyles = {
			image: waterfall
		};

		this.state = getPersistedState(this.defaultState);

		// Make sure shadow alpha is correct
		const { shadowColor, shadowOpacity } = this.state.dropShadow;
		this.state.dropShadow.shadowColor = tinycolor(shadowColor).setAlpha(shadowOpacity / 100);

		this.generateCSS = this.generateCSS.bind(this);
		this.renderInputs = this.renderInputs.bind(this);
		this.updateGenerator = this.updateGenerator.bind(this);
	}

	updateGenerator(state) {
	  this.setState(state);
	}

	generateCSS(styles = {}) {
		const rules = _.extend({}, this.state, styles);
		const css = {};

		var filtersString = '';

		// Loop through all filters and add any that are active
		_.each(filters, (filter, name) => {
			const { value, isActive } = rules[name];

			if (isActive) {
				const property = jsToCss(name);
				const unit = filter.unit;
				const cssString = `${property}(${value}${unit}) `;
				
				// Add filter type to css rules
				filtersString += cssString;
			}
		});

		// Add drop shadow
		if (rules.dropShadow.isActive) {
			const { horizontalShift, verticalShift, blurRadius, shadowOpacity, shadowColor } = rules.dropShadow;
			filtersString += `drop-shadow(${horizontalShift}px ${verticalShift}px ${blurRadius}px ${hexOrRgba(shadowColor)})`;
		}

		css.filter = filtersString.trim();

		return {
			styles: css,
			output: generateCSSString(css)
		}
	}

	renderInputs() {
		return (
			<FilterInputs
				updateGenerator={this.updateGenerator}
				filterSliders={this.filterSliders}
				dropShadowSliders={dropShadowSliders}
				{...this.state}
			/>
		);
	}

	render() {
		const generatorState = _.extend({}, this.state, { css: this.generateCSS() });

	  return (
	    <SingleWindowGenerator 
	    	// Text content
	      title="CSS Filter Generator | CSS-GEN"
	      previewID="filter-preview"
	      className="filter"
	      heading="CSS Filter Generator"

	      // Generator settings
	      hideToolbarBackground={true}
	      hasBrowserPrefixes={true}

	      // Render generator components
	      renderInputs={this.renderInputs}

	      // Generator state
	      generatorState={generatorState}
	      previewStyles={this.previewStyles}
	      generatorDefaultState={this.defaultState}
	      globalState={this.props.globalState}
	      
	      // Generator methods
	      updateGenerator={this.updateGenerator}
	    />
	  );
	}
}

export default Filter;