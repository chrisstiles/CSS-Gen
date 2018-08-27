import React from 'react';
import Sliders from '../../input/Sliders';
import ColorPicker from '../../input/ColorPicker';
import ButtonSelect from '../../input/ButtonSelect';
import Arrow from './arrow.svg';
import _ from 'underscore';

const sliders = [
	{ name: 'width', title: 'Width', min: 1, max: 800, appendString: 'px', className: 'wide-input' },
	{ name: 'left', title: 'Left', min: 1, max: 400, appendString: 'px', className: 'half wide-input' },
	{ name: 'right', title: 'Right', min: 1, max: 400, appendString: 'px', className: 'half no-margin wide-input' },
	{ name: 'height', title: 'Height', min: 1, max: 800, appendString: 'px', className: 'wide-input' },
	{ name: 'top', title: 'Top', min: 1, max: 400, appendString: 'px', className: 'half wide-input' },
	{ name: 'bottom', title: 'Bottom', min: 1, max: 400, appendString: 'px', className: 'half no-margin wide-input' }
];

class TriangleInputs extends React.Component {
	constructor(props) {
	  super(props);
	  
	  this.handleChange = this.handleChange.bind(this);
	  this.handleSizeChange = this.handleSizeChange.bind(this);
	  this.handleDirectionChange = this.handleDirectionChange.bind(this);
	}

	handleChange(value, name) {
		var state = {};
		state[name] = value;
	  
	  this.props.updateGenerator(state);
	}

	handleSizeChange(value, name) {
		var state = {};
		state[name] = value;

		const halfValue = value / 2;

		switch (name) {
			case 'width':
				state.left = halfValue;
				state.right = halfValue;
				break;
			case 'height':
				state.top = halfValue;
				state.bottom = halfValue;
				break;
			case 'left':
				state.width = value + this.props.right;
				break;
			case 'right':
				state.width = value + this.props.left;
				break;
			case 'top':
				state.height = value + this.props.bottom;
				break;
			case 'bottom':
				state.height = value + this.props.top;
				break;
			default:
				break;
		}

		const changeDirections = ['top left', 'top right', 'bottom right', 'bottom left'];
		
		// Isosceles
		const { type, direction } = this.props;
		
		if (type === 'isosceles') {
			if (_.contains(changeDirections, direction)) {
				if (name === 'width') {
					state.height = value;
					state.top = halfValue;
					state.bottom = halfValue;
				} else if (name === 'height') {
					state.width = value;
					state.left = halfValue;
					state.right = halfValue;
				}
			}
		}

		this.props.updateGenerator(state);
	}

	handleDirectionChange(direction) {
		var state = {};
		state.direction = direction;

		const { type, width } = this.props;
		const changeDirections = ['top left', 'top right', 'bottom right', 'bottom left'];

		// Equilateral
		if (type === 'equilateral') {
			if (_.contains(changeDirections, direction)) {
				state.type = 'isosceles';
			}
		}

		// Isosceles
		if (type === 'isosceles') {
			if (_.contains(changeDirections, direction)) {
				state.height = width;
				state.top = width / 2;
				state.bottom = width / 2;
			}
		}

		this.props.updateGenerator(state);
	}

	shouldDisableSlider(name) {
		const { type, direction } = this.props;
		var enableSliders = [];

		// Equilateral
		if (type === 'equilateral') {
			switch (direction) {
				case 'top':
				case 'bottom':
					enableSliders = ['width'];
					break;
				case 'left':
				case 'right':
					enableSliders = ['height'];
					break;
				default:
					break;
			}
		}

		// Isosceles
		if (type === 'isosceles') {
			enableSliders = ['width', 'height'];
		}

		// Scalene
		if (type === 'scalene') {
			switch (direction) {
				case 'top':
				case 'bottom':
					enableSliders = ['height', 'left', 'right'];
					break;
				case 'left':
				case 'right':
					enableSliders = ['width', 'top', 'bottom'];
					break;
				default:
					enableSliders = ['width', 'height'];
					break;
			}
		}

		return !_.contains(enableSliders, name);
	}

	render() {
		const { type, direction, width, height, color } = this.props;

		const typeOptions = [
			{ 
				value: 'equilateral', 
				label: 'Equilateral',
				disabled: _.contains(['top left', 'top right', 'bottom right', 'bottom left'], direction)
			},
			{ value: 'isosceles', label: 'Isosceles' },
			{ value: 'scalene', label: 'Scalene' }
		];

		const sizeSliders = _.map(sliders, sliderProps => {

			const data = {
				disabled: this.shouldDisableSlider(sliderProps.name),
				value: this.props[sliderProps.name]
			};

			return _.extend({}, sliderProps, data);
		});

	  return (
	  	<div>
		  	<ButtonSelect
		  		label="Triangle Type"
		  		name="type"
		  		options={typeOptions}
	  			value={type}
	  			onChange={this.handleChange}
		  	/>
	  		<div className="inputs-row">
		  		<ButtonSelect
		  			label="Triangle Direction"
		  			name="direction"
		  			className="triangle-direction"
		  			options={[
		  				{ value: 'top', label: <Arrow />, className: 'top' },
		  				{ value: 'bottom', label: <Arrow />, className: 'bottom' },
		  				{ value: 'left', label: <Arrow />, className: 'left' },
		  				{ value: 'right', label: <Arrow />, className: 'right' },
		  				{ value: 'top right', label: <Arrow />, className: 'top-right' },
		  				{ value: 'bottom left', label: <Arrow />, className: 'bottom-left' },
		  				{ value: 'top left', label: <Arrow />, className: 'top-left' },
		  				{ value: 'bottom right', label: <Arrow />, className: 'bottom-right' }
		  			]}
		  			value={direction}
		  			onChange={this.handleDirectionChange}
		  		/>
			  	<ColorPicker
			  		className="align-right"
			  		label="Color"
			  		color={color}
			  		name="color"
			  		onChange={this.handleChange}
			  	/>
		  	</div>
		  	<Sliders
		  		sliders={sizeSliders}
		  		onChange={this.handleSizeChange}
		  	/>
	  	</div>
	  );
	}
}

export default TriangleInputs;