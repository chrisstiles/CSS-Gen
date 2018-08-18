import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import FilterInputs from './FilterInputs';
import { getPersistedState, generateCSSString, jsToCss } from '../../../util/helpers';
import _ from 'underscore';

// Load default background images
import waterfall from './images/waterfall.jpg';

const filters = {
	blur: { title: 'Gaussian Blur', name: 'blur', min: 0, max: 50, value: 0, unit: 'px' },
	brightness: { title: 'Brightness', name: 'brightness', min: 0, max: 500, value: 100, unit: '%' },
	contrast: { title: 'Contrast', name: 'contrast', min: 0, max: 500, value: 100, unit: '%' },
	grayscale: { title: 'Grayscale', name: 'grayscale', min: 0, max: 100, value: 0, unit: '%' },
	invert: { title: 'Invert', name: 'invert', min: 0, max: 100, value: 0, unit: '%' },
	opacity: { title: 'Opacity', name: 'opacity', min: 0, max: 100, value: 100, unit: '%' },
	saturate: { title: 'Saturation', name: 'saturate', min: 0, max: 500, value: 100, unit: '%' },
	sepia: { title: 'Sepia', name: 'sepia', min: 0, max: 100, value: 0, unit: '%' },
	hueRotate: { value: 0, slider: false, unit: 'deg' }
};

const dropShadowSliders = [
  { title: 'Horizontal Shift', name: 'horizontalShift', min: -200, max: 200, appendString: 'px', value: 0 },
  { title: 'Vertical Shift', name: 'verticalShift', min: -200, max: 200, appendString: 'px', value: 12 },
  { title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100, appendString: 'px', value: 40 },
  { title: 'Spread Radius', name: 'spreadRadius', min: -100, max: 100, appendString: 'px', value: 0 },
  { title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 100, appendString: '%', value: '#000' }
];

class Filter extends React.Component {
	constructor(props) {
		super(props);

		// Add basic filters that only require one slider
		this.filterSliders = [];

		this.defaultState = _.mapObject(filters, ({ title, name, min, max, value, unit, slider }, key) => {

			if (slider || slider === undefined) {
				this.filterSliders.push({ title, name, min, max, appendString: unit });
			}
		
			return { value, isActive: false };
		})

		// Add drop shadow separately
		this.defaultState.dropShadow = {
			isActive: false
		};

		_.each(dropShadowSliders, ({ name, value }) => {
			this.defaultState.dropShadow[name] = value;
		});

		this.previewStyles = {
			image: waterfall
		};

		this.state = getPersistedState(this.defaultState);

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
				sliders={this.filterSliders}
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
	      browserPrefixes={true}

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