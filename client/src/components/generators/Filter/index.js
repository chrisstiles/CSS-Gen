import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import FilterInputs from './FilterInputs';
import { getDefaultState, getPersistedState, generateCSSString, cssToJs } from '../../../util/helpers';
import _ from 'underscore';

// Load default background images
import waterfall from './images/waterfall.jpg';

// List out all potential filters
const units = {
	px: 'px',
	deg: 'deg',
	percent: '%',
	none: ''
};

const filters = {
	blur: { unit: units.px, default: 6 },
	brightness: { unit: units.none, default: null },
	contrast: { unit: units.percent, default: null },
	grayscale: { unit: units.percent, default: null },
	hueRotate: { unit: units.deg, default: null },
	invert: { unit: units.percent, default: null },
	opacity: { unit: units.percent, default: null },
	saturate: { unit: units.percent, default: null },
	sepia: { unit: units.percent, default: null }
};

class Filter extends React.Component {
	constructor(props) {
		super(props);

		// Create initial state from filters object
		var state = _.mapObject(filters, (val, key) => {
			return val.default;
		});

		// Add additional defaults
		state = _.extend({}, state, {
			backgroundImage: waterfall,
			width: 500,
			height:400
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
				this.setState({ backgroundImage: e.target.result });
			}

			reader.readAsDataURL(file);
		}
	}

	renderInputs() {
		return (
			<FilterInputs
				owner={this}
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
	      centerPreview={false}
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