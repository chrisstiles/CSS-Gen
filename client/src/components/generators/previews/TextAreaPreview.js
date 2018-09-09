import React from 'react';
import _ from 'underscore';

class TextAreaPreview extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value
		}
	}

	handleChange(event) {
		const state = {};
		state[this.props.name] = event.target.value;
		this.props.onChange(state);
		// this.setState({ value: event.target.value });
	}

	render() {
		// const newProps = {
		// 	onChange: this.handleChange.bind(this),
		// 	value: this.state.value
		// };

		// const props = _.extend({}, this.props, newProps);

		const props = _.extend({}, this.props, { onChange: this.handleChange.bind(this) });

		// props.defaultValue = this.props.value;
		// delete props.value;
		// console.log(props)

		return (
			<textarea
				id="text-area-preview"
				{...props}
			/>
		);
	}
}

export default TextAreaPreview;