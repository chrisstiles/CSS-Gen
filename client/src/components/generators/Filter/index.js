import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import FilterInputs from './FilterInputs';
import { getDefaultState, getPersistedState, generateCSSString, cssToJs } from '../../../util/helpers';
import _ from 'underscore';

// Load default background images
import waterfall from './images/waterfall.jpg';

// List out all potential filters
// const units = {
// 	px: 'px',
// 	deg: 'deg',
// 	percent: '%',
// 	none: ''
// };

// const filters = {
// 	blur: { unit: units.px, default: null },
// 	brightness: { unit: units.percent, default: null },
// 	contrast: { unit: units.percent, default: null },
// 	grayscale: { unit: units.percent, default: null },
// 	hueRotate: { unit: units.deg, default: null },
// 	invert: { unit: units.percent, default: null },
// 	opacity: { unit: units.percent, default: null },
// 	saturate: { unit: units.percent, default: null },
// 	sepia: { unit: units.percent, default: null }
// };

// const filters = [
//   { title: 'Gaussian Blur', name: 'blur', min: 0, max: 300, defaultValue: 0, appendString: 'px' },
//   { title: 'Brightness', name: 'brightness', min: 0, max: 500, defaultValue: 100, appendString: '%' },
//   { title: 'Contrast', name: 'contrast', min: 0, max: 500, defaultValue: 100, appendString: '%' },
//   { title: 'Grayscale', name: 'grayscale', min: 0, max: 100, defaultValue: 0, appendString: '%' },
//   { title: 'Invert', name: 'invert', min: 0, max: 100, defaultValue: 0, appendString: '%' },
//   { title: 'Opacity', name: 'opacity', min: 0, max: 100, defaultValue: 100, appendString: '%' },
//   { title: 'Saturation', name: 'saturate', min: 0, max: 500, defaultValue: 100, appendString: '%' },
//   { title: 'Sepia', name: 'sepia', min: 0, max: 100, defaultValue: 0, appendString: '%' },
// ];

const filters = {
	blur: { title: 'Gaussian Blur', name: 'blur', min: 0, max: 300, value: 0, unit: 'px' },
	brightness: { title: 'Brightness', name: 'brightness', min: 0, max: 500, value: 100, unit: '%' },
	contrast: { title: 'Contrast', name: 'contrast', min: 0, max: 500, value: 100, unit: '%' },
	grayscale: { title: 'Grayscale', name: 'grayscale', min: 0, max: 100, value: 0, unit: '%' },
	// hueRotate: { unit: units.deg, default: null },
	invert: { title: 'Invert', name: 'invert', min: 0, max: 100, value: 0, unit: '%' },
	opacity: { title: 'Opacity', name: 'opacity', min: 0, max: 100, value: 100, unit: '%' },
	saturate: { title: 'Saturation', name: 'saturate', min: 0, max: 500, value: 100, unit: '%' },
	sepia: { title: 'Sepia', name: 'sepia', min: 0, max: 100, value: 0, unit: '%' }
};

class Filter extends React.Component {
	constructor(props) {
		super(props);

		// Create initial state from filters object
		// var state = _.mapObject(filters, (val, key) => {
		// 	return val.default;
		// });

		this.filterSliders = [];
		var state = _.mapObject(filters, ({ title, name, min, max, value, unit }, key) => {
			this.filterSliders.push({ title, name, min, max, appendString: unit });

			return { value, isActive: false };
		});

		// Add additional defaults
		state = _.extend({}, state, {
			image: waterfall
		});

		this.defaultState = getDefaultState(state);
		this.state = getPersistedState(this.defaultState);

		this.handleFileDrop = this.handleFileDrop.bind(this);
		this.generateCSS = this.generateCSS.bind(this);
		this.renderInputs = this.renderInputs.bind(this);
	}

	generateCSS(styles = {}) {
		const rules = _.extend({}, this.state, styles);
		const css = {
			filter: ''
		};

		// Loop through all filters and add any that are active
		_.each(filters, (filter, name) => {
			const value = rules[name];

			if (value !== null) {
				const property = cssToJs(name);
				const unit = filter.unit;
				const cssString = `${property}(${value}${unit}) `;
				
				// Add filter type to css rules
				css.filter += cssString;
			}
		});

		css.filter = css.filter.trim();

		return {
			styles: css,
			outputCSS: generateCSSString(css)
		}
	}

	handleFileDrop(event) {
		const files = event.nativeEvent.dataTransfer.files;

		if (files && files.length) {
			const file = files[0];
			const reader = new FileReader();
			reader.onload = e => {
				const image = e.target.result;

				this.setState({ image: image });
			}

			reader.readAsDataURL(file);
		}
	}

	renderInputs() {
		return (
			<FilterInputs
				owner={this}
				sliders={this.filterSliders}
				{...this.state}
			/>
		);
	}

	render() {
	  return (
	    <SingleWindowGenerator 
	      title="CSS Filter Generator | CSS-GEN"
	      previewID="filter-preview"
	      className="filter"
	      heading="CSS Filter Generator"
	      generateCSS={this.generateCSS}
	      renderInputs={this.renderInputs}
	      styles={this.state}
	      generator={this}
	      fullWidthPreview={true}
	      hideToolbarBackground={true}
	      onFileDrop={this.handleFileDrop}
	      defaultState={this.defaultState}
	      globalState={this.props.globalState}
	      browserPrefixes={true}
	    />
	  );
	}
}

export default Filter;