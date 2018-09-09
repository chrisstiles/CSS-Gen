import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import TextShadowInputs from './TextShadowInputs';
import TextAreaPreview from '../previews/TextAreaPreview';
import { getState, generateCSSString } from '../../../util/helpers';
import _ from 'underscore';

class TextShadow extends React.Component {
	constructor(props) {
		super(props);

		this.defaultState = {
			text: 'My text here',
			fontSize: 40,
			googleFont: 'Montserrat'
		};

		this.stateTypes = {
			text: String,
			fontSize: Number,
			googleFont: String
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

		css.fontSize = `${rules.fontSize}px`;
		css.textShadow = '2px 2px 2px #1C6EA4';

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