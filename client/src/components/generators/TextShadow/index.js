import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import TextShadowInputs from './TextShadowInputs';
import TextAreaPreview from '../previews/TextAreaPreview';
import { getState, generateCSSString, hexOrRgba } from '../../../util/helpers';
import _ from 'underscore';
import WebFont from 'webfontloader';
const defaultFont = 'Montserrat';

class TextShadow extends React.Component {
	constructor(props) {
		super(props);

		this.defaultState = {
			text: 'My text here',
			fontSize: 40,
			googleFont: defaultFont,
			fontFamily: `"${defaultFont}", sans-serif`,
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
			fontFamily: String,
			horizontalShift: Number,
			verticalShift: Number,
			blurRadius: Number,
			shadowOpacity: Number,
			shadowColor: String,
			fontColor: String
		};

		this.state = getState(this.defaultState, this.stateTypes);

		// Load font if default is not selected
		if (this.state.googleFont !== defaultFont) {
			this.state.previewContentLoaded = false;
		} else {
			this.state.previewContentLoaded = true;
		}

		this.updateGenerator = this.updateGenerator.bind(this);
		this.renderInputs = this.renderInputs.bind(this);
		this.renderPreview = this.renderPreview.bind(this);
	}

	componentDidMount() {
		const { previewContentLoaded, googleFont } = this.state;
		if (!previewContentLoaded) {
			WebFont.load({
				google: {
					families: [googleFont]
				},
				fontactive: () => {
					this.setState({ previewContentLoaded: true });
				},
				fontinactive: () => {
					this.setState(this.defaultState);
				},
				classes: false
			})
		}
	}

	updateGenerator(state) {
	  this.setState(state);
	}

	generateCSS(styles = {}) {
		const rules = _.extend({}, this.state, styles);
		const css = {};

		// Text shadow
		const { horizontalShift, verticalShift, blurRadius, shadowColor, shadowOpacity } = rules;
		css.textShadow = `${horizontalShift}px ${verticalShift}px ${blurRadius}px ${hexOrRgba(shadowColor, shadowOpacity / 100)}`;

		// Font settings
		css.color = hexOrRgba(rules.fontColor);
		css.fontFamily = rules.fontFamily;
		css.fontSize = `${rules.fontSize}px`;

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
		const previewStyles = { previewContentLoaded: this.state.previewContentLoaded };
		console.log(previewStyles)
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
				previewStyles={previewStyles}

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