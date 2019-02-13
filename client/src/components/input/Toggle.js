import React from 'react';

class Toggle extends React.PureComponent {
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
		const { className, disabled, inline, label } = this.props;
		const wrapperClassName = ['toggle-wrapper'];
		
		if (className) {
			wrapperClassName.push(className);
		}

		if (disabled) {
			wrapperClassName.push('disabled');
		}

		const labelClassName = ['toggle-label'];

		if (label) {
			labelClassName.push('title');
		}

		if (inline) {
			labelClassName.push('inline');
		}

		return (
			<div className={wrapperClassName.join(' ')}>
				<label className={labelClassName.join(' ')}>
					{label ? <span>{label}</span> : null}
					<div className="switch-wrapper">
						<input
							name={this.props.name}
							type="checkbox"
							onChange={this.handleChange}
							checked={this.props.checked}
						/>
						<span className="switch"></span>
					</div>
				</label>
				{this.props.children ?
					<div className="toggle-content">{this.props.children}</div>
				: null}
			</div>
		);
	}
}

export default Toggle;