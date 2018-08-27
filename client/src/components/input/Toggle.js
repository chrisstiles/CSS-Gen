import React from 'react';

class Toggle extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		const el = event.target;
		const value = el.type === 'checkbox' ? el.checked : el.value;

		this.props.onChange(value, this.props.name);
	}

	renderLabel() {
		if (this.props.label) {
			return <label className="title">{this.props.label}</label>;
		}
	}

	render() {
		return (
			<div>
				{this.renderLabel()}
				<label className="toggle-wrapper">
					<input
						name={this.props.name}
						type="checkbox"
						onChange={this.handleChange}
						checked={this.props.checked}
					/>
					<span className="toggle"></span>
				</label>
				{this.props.children ?
					<div className="toggle-content">{this.props.children}</div>
				: null}
			</div>
		);
	}
}

export default Toggle;