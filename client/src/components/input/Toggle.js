import React from 'react';

class Toggle extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const el = event.target;
		const value = el.type === 'checkbox' ? el.checked : el.value;

		this.props.onChange(value);
	}

	render() {
		return (
			<div>
				<div className="title">{this.props.label}</div>
				<label className="toggle-wrapper">
					<input
						name={this.props.name}
						type="checkbox"
						onChange={this.handleChange}
					/>
					<span className="toggle"></span>
				</label>
			</div>
		);
	}
}

export default Toggle;