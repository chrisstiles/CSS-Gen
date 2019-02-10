import React from 'react';
import _ from 'underscore';

class ButtonOption extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		if (!this.props.active && !this.props.disabled) {
		  this.props.onClick(this.props.name);
		}
	}

	render() {
		const { active, name, className, disabled } = this.props;
		
		let { label } = this.props;

		if (!label) {
			label = name.charAt(0).toUpperCase() + name.slice(1);
		}

		let optionClassName = ['option'];

		if (active) {
			optionClassName.push('active');
		}

		if (className) {
			optionClassName.push(className);
		}

		if (disabled) {
			optionClassName.push('disabled');
		}

		return (
		  <div 
				className={optionClassName.join(' ')}
		    onClick={this.handleClick}
		  >
		  	{label}
		  </div>
		);
	}
}

class ButtonSelect extends React.PureComponent {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(option) {
		this.props.onChange(option, this.props.name);
	}

	render() {
		const { label, options, value, equalWidths, className: wrapperClass } = this.props;

		const buttons = _.map(options, ({ value: name, label, disabled, className: optionClass, }) => {
			const active = name === value;
			const className = optionClass ? optionClass : '';

			return (
				<ButtonOption
					key={name}
					name={name}
					active={active}
					label={label}
					className={className}
					disabled={disabled}
					onClick={this.handleChange}
				/>
			);
		});

		var buttonClass = 'button-select';

		if (wrapperClass) {
			buttonClass += ` ${wrapperClass}`;
		}

		if (equalWidths) {
			buttonClass += ' equal-widths';
		}

		return (
			<div className="field-wrapper">
				{label ? 
					<label className="title">{label}</label>
				: null}
				<div className={buttonClass}>
					{buttons}
				</div>
			</div>
		);
	}
}

export default ButtonSelect;