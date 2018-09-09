import React from 'react';
import _ from 'underscore';

class TextAreaPreview extends React.Component {
	handleChange(event) {
		const state = {};
		state[this.props.name] = event.target.value;
		this.props.onChange(state);
	}

	render() {
		const props = _.extend({}, this.props, { onChange: this.handleChange.bind(this) });

		return (
			<textarea
				id="text-area-preview"
				{...props}
			/>
		);
	}
}

export default TextAreaPreview;