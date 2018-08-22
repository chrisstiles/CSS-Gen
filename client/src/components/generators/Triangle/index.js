import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import { getState } from '../../../util/helpers';
import _ from 'underscore';

class Triangle extends React.Component {
	constructor(props) {
		super(props);

		this.defaultState = {
			direction: 'top',
			type: 'isosceles',
			width: 150,
			left: 75,
			right: 75,
			height: 120,
			top: 60,
			bottom: 60
		};

		this.stateTypes = {
			direction: String,
			type: String,
			width: Number,
			left: Number,
			right: Number,
			height: Number,
			top: Number,
			bottom: Number
		};

		this.state = getState(this.defaultState, this.stateTypes);

		this.renderInputs = this.renderInputs.bind(this);
		this.updateGenerator = this.updateGenerator.bind(this);
	}

	updateGenerator(state) {
	  this.setState(state);
	}

	generateCSS(styles = {}) {
	  const rules = _.extend({}, this.state, styles);
	  
	  return {
	    styles: {
	    	width: 0,
	    	height: 0,
	    	borderStyle: 'solid',
	    	borderWidth: '0 75px 120px 75px',
	    	borderColor: 'transparent transparent #4834d4 transparent'
	    },
	    output: `
	    	width: 0;
	    	height: 0;
	    	border-style: solid;
	    	border-width: 0 75px 120px 75px;
	    	border-color: transparent transparent #4834d4 transparent;
	    `
	  };
	}

	renderInputs() {
		return 'Hello';
	}

	render() {
		const generatorState = _.extend({}, this.state, { css: this.generateCSS() });

		return (
		  <StaticWindowGenerator 
		    // Text Content
		    title="CSS Triangle Generator | CSS-GEN"
		    previewID="triangle-preview"
		    className="triangle"
		    heading="CSS Triangle Generator"

		    // Generator state
		    generatorState={generatorState}
		    generatorDefaultState={this.defaultState}
		    globalState={this.props.globalState}

		    // Render generator components
		    renderInputs={this.renderInputs}

		    // Generator methods
		    updateGenerator={this.updateGenerator}        
		  />
		);
	}
}

export default Triangle;