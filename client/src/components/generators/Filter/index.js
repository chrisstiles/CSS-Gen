import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import FilterInputs from './FilterInputs';
import { getDefaultState, getPersistedState, generateCSSString, cssToJs } from '../../../util/helpers';
import _ from 'underscore';

// Load default background images
import waterfall from './images/waterfall.jpg';

const filters = {
	blur: { title: 'Gaussian Blur', name: 'blur', min: 0, max: 300, value: 0, unit: 'px' },
	brightness: { title: 'Brightness', name: 'brightness', min: 0, max: 500, value: 100, unit: '%' },
	contrast: { title: 'Contrast', name: 'contrast', min: 0, max: 500, value: 100, unit: '%' },
	grayscale: { title: 'Grayscale', name: 'grayscale', min: 0, max: 100, value: 0, unit: '%' },
	invert: { title: 'Invert', name: 'invert', min: 0, max: 100, value: 0, unit: '%' },
	opacity: { title: 'Opacity', name: 'opacity', min: 0, max: 100, value: 100, unit: '%' },
	saturate: { title: 'Saturation', name: 'saturate', min: 0, max: 500, value: 100, unit: '%' },
	sepia: { title: 'Sepia', name: 'sepia', min: 0, max: 100, value: 0, unit: '%' }
};

class Filter extends React.Component {
	constructor(props) {
		super(props);

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
		const css = {};

		var filtersString = '';

		// Loop through all filters and add any that are active
		_.each(filters, (filter, name) => {
			const { value, isActive } = rules[name];

			if (isActive) {
				const property = cssToJs(name);
				const unit = filter.unit;
				const cssString = `${property}(${value}${unit}) `;
				
				// Add filter type to css rules
				filtersString += cssString;
			}
		});

		css.filter = filtersString.trim();

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