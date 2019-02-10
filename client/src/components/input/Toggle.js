import React from 'react';

class Toggle extends React.Component {
	constructor(props) {
		super(props);

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(event) {
		if (!this.props.disabled) {
			const el = event.target;
			const value = el.type === 'checkbox' ? el.checked : el.value;

			this.props.onChange(value, this.props.name);
		}
	}

	renderLabel() {
		if (this.props.label) {
			return <label className="title">{this.props.label}</label>;
		}
	}

	render() {
		const className = ['toggle-wrapper'];
		
		if (this.props.className) {
			className.push(this.props.className);
		}

		if (this.props.disabled) {
			className.push('disabled');
		}

		if (this.props.inline) {
			className.push('inline');
		}

		return (
			<div className={className.join(' ')}>
				{this.renderLabel()}
				<label className="switch-wrapper">
					<input
						name={this.props.name}
						type="checkbox"
						onChange={this.handleChange}
						checked={this.props.checked}
					/>
					<span className="switch"></span>
				</label>
				{this.props.children ?
					<div className="toggle-content">{this.props.children}</div>
				: null}
			</div>
		);
	}
}

export default Toggle;