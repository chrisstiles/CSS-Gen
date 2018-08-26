import React from 'react';
import _ from 'underscore';

class ButtonOption extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		if (!this.props.active) {
		  this.props.onClick(this.props.name);
		}
	}

	render() {
		const { active, name } = this.props;
		var { label } = this.props;
		var className = 'option';

		if (active) {
		  className += ' active';
		}

		if (!label) {
			label = name.charAt(0).toUpperCase() + name.slice(1);
		}

		return (
		  <div 
		    className={className}
		    onClick={this.handleClick}
		  >
		  	{label}
		  </div>
		);
	}
}

class ButtonSelect extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(option) {
		this.props.onChange(option, this.props.name);
	}

	render() {
		const { label, options, value } = this.props;

		const buttons = _.map(options, ({ value: name, label }) => {
			const active = name === value;

			return (
				<ButtonOption
					key={name}
					name={name}
					active={active}
					label={label}
					onClick={this.handleChange}
				/>
			);
		});

		return (
			<div className="field-wrapper">
				{label ? 
					<label className="title">{label}</label>
				: null}
				<div className="button-select">
					{buttons}
				</div>
			</div>
		);
	}
}

export default ButtonSelect;