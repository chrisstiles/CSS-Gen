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
	  const { direction, width, left, right, height, top, bottom } = rules;
	  const color = hexOrRgba(rules.color);
	  const halfWidth = width / 2;
	  const halfHeight = height / 2;
	  var { type } = rules;

	  // Add styles that don't change
	  const css = {
	  	width: 0,
	  	height: 0,
	  	borderStyle: 'solid'
	  };

	  // Equilateral triangles cannot be diagonal
	  const equilateralDirections = ['top', 'right', 'bottom', 'left'];
	  if (!_.contains(equilateralDirections, direction)) {
	  	type = 'isosceles';
	  }

	  // Equilateral
	  if (type === 'equilateral') {
	  	const size = direction === 'top' || direction === 'bottom' ? halfWidth : halfHeight;
	  	const sideLength = (Math.sqrt(Math.pow(size, 2) - Math.pow(size / 2, 2)) * 2).toFixed(2);

	  	switch (direction) {
	  		case 'top':
	  			css.borderWidth = `0 ${size}px ${sideLength}px ${size}px`;
	  			css.borderColor = `transparent transparent ${color} transparent`;
	  			break;
	  		case 'right':
	  			css.borderWidth = `${size}px 0 ${size}px ${sideLength}px`;
	  			css.borderColor = `transparent transparent transparent ${color}`;
	  			break;
	  		case 'bottom':
	  			css.borderWidth = `${sideLength}px ${size}px 0 ${size}px`;
	  			css.borderColor = `${color} transparent transparent transparent`;
	  			break;
	  		case 'left':
	  			css.borderWidth = `${size}px ${sideLength}px ${size}px 0`;
	  			css.borderColor = `transparent ${color} transparent transparent`;
	  			break;
	  		default:
	  			break;
	  	}
	  }

	  // Isosceles
	  if (type === 'isosceles') {
	  	switch (direction) {
	  		case 'top':
	  			css.borderWidth = `0 ${halfWidth}px ${height}px ${halfWidth}px`;
	  			css.borderColor = `transparent transparent ${color} transparent`;
	  			break;
	  		case 'top right':
	  			css.borderWidth = `0 ${width}px ${width}px 0`;
	  			css.borderColor = `transparent ${color} transparent transparent`;
	  			break;
	  		case 'right':
	  			css.borderWidth = `${halfHeight}px 0 ${halfHeight}px ${width}px`;
	  			css.borderColor = `transparent transparent transparent ${color}`;
	  			break;
	  		case 'bottom right':
	  			css.borderWidth = `0 0 ${width}px ${width}px`;
	  			css.borderColor = `transparent transparent ${color} transparent`;
	  			break;
	  		case 'bottom':
	  			css.borderWidth = `${height}px ${halfWidth}px 0 ${halfWidth}px`;
	  			css.borderColor = `${color} transparent transparent transparent`;
	  			break;
	  		case 'bottom left':
	  			css.borderWidth = `${width}px 0 0 ${width}px`;
	  			css.borderColor = `transparent transparent transparent ${color}`;
	  			break;
	  		case 'left':
	  			css.borderWidth = `${halfHeight}px ${width}px ${halfHeight}px 0`;
	  			css.borderColor = `transparent ${color} transparent transparent`;
	  			break;
	  		case 'top left':
	  			css.borderWidth = `${width}px ${width}px 0 0`;
	  			css.borderColor = `${color} transparent transparent transparent`;
	  			break;
	  		default:
	  			break;
	  	}
	  }

	  // Scalene
	  if (type === 'scalene') {
	  	switch (direction) {
	  		case 'top':
	  			css.borderWidth = `0 ${right}px ${height}px ${left}px`;
	  			css.borderColor = `transparent transparent ${color} transparent`;
	  			break;
	  		case 'top right':
	  			css.borderWidth = `0 ${width}px ${height}px 0`;
	  			css.borderColor = `transparent ${color} transparent transparent`;
	  			break;
	  		case 'right':
	  			css.borderWidth = `${top}px 0 ${bottom}px ${width}px`;
	  			css.borderColor = `transparent transparent transparent ${color}`;
	  			break;
	  		case 'bottom right':
	  			css.borderWidth = `0 0 ${height}px ${width}px`;
	  			css.borderColor = `transparent transparent ${color} transparent`;
	  			break;
	  		case 'bottom':
	  			css.borderWidth = `${height}px ${right}px 0 ${left}px`;
	  			css.borderColor = `${color} transparent transparent transparent`;
	  			break;
	  		case 'bottom left':
	  			css.borderWidth = `${height}px 0 0 ${width}px`;
	  			css.borderColor = `transparent transparent transparent ${color}`;
	  			break;
	  		case 'left':
	  			css.borderWidth = `${top}px ${width}px ${bottom}px 0`;
	  			css.borderColor = `transparent ${color} transparent transparent`;
	  			break;
	  		case 'top left':
	  			css.borderWidth = `${height}px ${width}px 0 0`;
	  			css.borderColor = `${color} transparent transparent transparent`;
	  			break;
	  		default:
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