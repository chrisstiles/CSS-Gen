import React from 'react';
import SingleWindowGenerator from '../types/SingleWindowGenerator';
import { getDefaultState, getPersistedState, generateCSSString } from '../../../util/helpers';
import _ from 'underscore';

// Load default background images
import waterfall from './images/waterfall.jpg';

class Filter extends React.Component {
	constructor(props) {
		super(props);

		this.defaultState = getDefaultState({
			blur: false,
			brightness: false,
			contrast: false,
			dropShadow: false,
			grayscale: false,
			hueRotate: false,
			invert: false,
			opacity: false,
			saturate: false,
			sepia: false,
			backgroundImage: waterfall,
			width: 500,
			height:600
		});

		this.state = getPersistedState(this.defaultState);

		this.handleFileDrop = this.handleFileDrop.bind(this);
		this.generateCSS = this.generateCSS.bind(this);
		this.renderInputs = this.renderInputs.bind(this);
	}

	generateCSS(styles = {}) {
		const rules = _.extend({}, this.state, styles);

		const css = { filter: 'blur(0)' };

		return {
			styles: css,
			outputCSS: generateCSSString(css)
		}
	}

	handleFileDrop(event) {
		// console.log(event.dataTransfer)
		// console.log(event.nativeEvent.dataTransfer.files)
		const files = event.nativeEvent.dataTransfer.files;

		if (files && files.length) {
			const file = files[0];
			const reader = new FileReader();
			reader.onload = e => {
				console.log(e.target.result);
				this.setState({ backgroundImage: e.target.result });
			}

			reader.readAsDataURL(file);
		}
	}

	renderInputs() {

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
	      onFileDrop={this.handleFileDrop}
	      defaultState={this.defaultState}
	      globalState={this.props.globalState}
	    />
	  );
	}
}

export default Filter;