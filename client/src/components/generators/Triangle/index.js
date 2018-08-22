import React from 'react';
import StaticWindowGenerator from '../types/StaticWindowGenerator';
import TriangleInputs from './TriangleInputs';
import { getState, hexOrRgba, generateCSSString } from '../../../util/helpers';
import _ from 'underscore';

////////////////////////////////////
// Scalene: 0 sides equal
// Isosceles: 2 sides equal
// Equilateral: 3 sides equal
////////////////////////////////////

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
			bottom: 60,
			color: '#4834d4'
		};

		this.stateTypes = {
			direction: String,
			type: String,
			width: Number,
			left: Number,
			right: Number,
			height: Number,
			top: Number,
			bottom: Number,
			color: String
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
	  const { direction, type, width, left, right, height, top, bottom } = rules;
	  const color = hexOrRgba(rules.color);

	  // Add styles that don't change
	  const css = {
	  	width: 0,
	  	height: 0,
	  	borderStyle: 'solid'
	  };

	  // Isosceles
	  if (type === 'isosceles') {
	  	switch (direction) {
	  		case 'top':
	  			css.borderWidth = `0 ${width / 2}px ${height}px ${width / 2}px`;
	  			css.borderColor = `transparent transparent ${color} transparent`;
	  			break;
	  		case 'top right':
	  			css.borderWidth = `0 ${width}px ${width}px 0`;
	  			css.borderColor = `transparent ${color} transparent transparent`;
	  			break;
	  		case 'right':
	  			css.borderWidth = `${height / 2}px 0 ${height / 2}px ${width}px`;
	  			css.borderColor = `transparent transparent transparent ${color}`;
	  			break;
	  		case 'bottom right':
	  			css.borderWidth = `0 0 ${width}px ${width}px`;
	  			css.borderColor = `transparent transparent ${color} transparent`;
	  			break;
	  		case 'bottom':
	  			css.borderWidth = `${height}px ${width / 2}px 0 ${width / 2}px`;
	  			css.borderColor = `${color} transparent transparent transparent`;
	  			break;
	  		case 'bottom left':
	  			css.borderWidth = `${width}px 0 0 ${width}px`;
	  			css.borderColor = `transparent transparent transparent ${color}`;
	  			break;
	  		case 'left':
	  			css.borderWidth = `${height / 2}px ${width}px ${height / 2}px 0`;
	  			css.borderColor = `transparent ${color} transparent transparent`;
	  			break;
	  		case 'top left':
	  			css.borderWidth = `${width}px ${width}px 0 0`;
	  			css.borderColor = `${color} transparent transparent transparent`;
	  			break;
	  	}
	  }
	  
	  return {
	    styles: css,
	    output: generateCSSString(css)
	  };
	}

	renderInputs() {
	  return (
	    <TriangleInputs
	      updateGenerator={this.updateGenerator}
	      {...this.state}
	    />
	  );
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