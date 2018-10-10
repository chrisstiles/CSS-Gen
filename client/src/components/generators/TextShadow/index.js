import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import TextShadowInputs from './TextShadowInputs';
import TextShadowPreview from './TextShadowPreview';
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
			variantOptions: [
				'100', 
				'100italic', 
				'200', 
				'200italic', 
				'300', 
				'300italic', 
				'regular', 
				'italic',
				'500',
				'500italic',
				'600',
				'600italic',
				'700',
				'700italic',
				'800',
				'800italic', 
				'900',
				'900italic'
			],
			variant: 'regular',
			fontFamily: `"${defaultFont}", sans-serif`,
			horizontalShift: 0,
			verticalShift: 2,
			blurRadius: 10,
			shadowOpacity: 15,
			shadowColor: '#000',
			fontColor: '#000',
			fontLoaded: true
		};

		this.stateTypes = {
			text: String,
			fontSize: Number,
			googleFont: String,
			variantOptions: [String],
			variant: String,
			fontFamily: String,
			horizontalShift: Number,
			verticalShift: Number,
			blurRadius: Number,
			shadowOpacity: Number,
			shadowColor: String,
			fontColor: String,
			fontLoaded: Boolean
		};

		this.state = getState(this.defaultState, this.stateTypes);

		// Load font if default is not selected
		if (this.state.googleFont !== defaultFont) {
			this.state.fontLoaded = false;
		} else {
			this.state.fontLoaded = true;
		}

		this.updateGenerator = this.updateGenerator.bind(this);
		this.renderInputs = this.renderInputs.bind(this);
		this.renderPreview = this.renderPreview.bind(this);
	}

	componentDidMount() {
		const { fontLoaded, googleFont } = this.state;
		if (!fontLoaded) {
			WebFont.load({
				google: {
					families: [googleFont]
				},
				fontactive: () => {
					this.setState({ fontLoaded: true });
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
		const { fontColor, fontFamily, fontSize } = rules;

		css.color = hexOrRgba(fontColor);
		css.fontFamily = fontFamily;
		css.fontSize = `${fontSize}px`;

		// Font variants
		const { variant } = rules;
		
		// Font style
		if (variant.indexOf('italic') !== -1) {
			css.fontStyle = 'italic';
		}

		// Font weight
		var weight = variant.replace('italic', '');
		if (!weight || weight === 'regular') {
			weight = '400';
		}

		css.fontWeight = weight;

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
			<TextShadowPreview
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