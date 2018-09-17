import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import TextShadowInputs from './TextShadowInputs';
import TextAreaPreview from '../previews/TextAreaPreview';
import { getState, generateCSSString, hexOrRgba } from '../../../util/helpers';
import _ from 'underscore';

class TextShadow extends React.Component {
	constructor(props) {
		super(props);

		this.defaultState = {
			text: 'My text here',
			fontSize: 40,
			googleFont: 'Montserrat',
			horizontalShift: 0,
			verticalShift: 2,
			blurRadius: 10,
			shadowOpacity: 15,
			shadowColor: '#000',
			fontColor: '#000'
		};

		this.stateTypes = {
			text: String,
			fontSize: Number,
			googleFont: String,
			horizontalShift: Number,
			verticalShift: Number,
			blurRadius: Number,
			shadowOpacity: Number,
			shadowColor: String,
			fontColor: String
		};

		this.state = getState(this.defaultState, this.stateTypes);

		this.updateGenerator = this.updateGenerator.bind(this);
		this.renderInputs = this.renderInputs.bind(this);
		this.renderPreview = this.renderPreview.bind(this);
	}

	updateGenerator(state) {
	  this.setState(state);
	}

	generateCSS(styles = {}) {
		const rules = _.extend({}, this.state, styles);
		const css = {};

		// Create tiny color with correct alpha
		// var color = rules.color === undefined ? this.state.shadowColor : rules.color;
		// color = tinycolor(color).setAlpha(rules.shadowOpacity / 100);

		css.color = hexOrRgba(rules.fontColor);
		css.fontSize = `${rules.fontSize}px`;
		css.textShadow = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${hexOrRgba(rules.shadowColor)}`;

		return {
			styles: css,
			output: generateCSSString(css)
		};
	}

	renderInputs() {
		return (
	    <TextShadowInputs
	      updateGenerator={this.updateGenerator}
	      {...this.state}
	    />
	  );
	}

	renderPreview(style) {
		return (
			<TextAreaPreview
				className="text-shadow-preview"
				value={this.state.text}
				name="text"
				style={style}
				placeholder="Click here to enter text"
				onChange={this.updateGenerator}
			/>
		);
	}

	render() {
		const generatorState = _.extend({}, this.state, { css: this.generateCSS() });

		return (
		  <StaticWindowGenerator 
		    // Text Content
		    title="CSS Text Shadow Generator | CSS-GEN"
		    previewID="text-shadow-preview"
		    className="text-shadow"
		    heading="CSS Text Shadow Generator"

		    // Generator state
		    generatorState={generatorState}
		    generatorDefaultState={this.defaultState}
		    globalState={this.props.globalState}

		    // Render generator components
		    renderInputs={this.renderInputs}
		    renderPreview={this.renderPreview}

		    // Generator methods
		    updateGenerator={this.updateGenerator}        
		  />
		);
	}
}

export default TextShadow;