import React from 'react';
import { propsHaveChanged } from '../../util/helpers';

class Toggle extends React.Component {
	shouldComponentUpdate(prevProps) {
		return propsHaveChanged(prevProps, this.props);
	}

	handleChange = (event) => {
		if (!this.props.disabled) {
			const el = event.target;
			const value = el.type === 'checkbox' ? el.checked : el.value;

			this.props.onChange(value, this.props.name);
		}
	}

	render() {
		const { 
			name,
			checked,
			className,
			disabled,
			inline,
			label,
			children
		} = this.props;
		
		const wrapperClassName = ['field-wrapper', 'toggle-wrapper'];
		if (className) wrapperClassName.push(className);
		if (disabled) wrapperClassName.push('disabled');

		const labelClassName = ['toggle-label'];
		if (label) labelClassName.push('title');
		if (inline) labelClassName.push('inline');

		return (
			<div className={wrapperClassName.join(' ')}>
				<label className={labelClassName.join(' ')}>
					{label ? <span>{label}</span> : null}
					<div className="switch-wrapper">
						<input
							name={name}
							type="checkbox"
							onChange={this.handleChange}
							checked={checked}
						/>
						<span className="switch"></span>
					</div>
				</label>
				{children ?
					<div className="toggle-content">{children}</div>
				: null}
			</div>
		);
	}
}

export default Toggle;