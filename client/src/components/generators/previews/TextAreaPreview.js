import React from 'react';
import _ from 'underscore';
import autosize from 'autosize';

class TextAreaPreview extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			value: props.value
		}
	}

	componentDidMount() {
		autosize(this.textarea);
	}

	handleChange(event) {
		const state = {};
		state[this.props.name] = event.target.value;
		this.props.onChange(state);
	}

	render() {
		const props = _.extend({}, this.props, { onChange: this.handleChange.bind(this) });

		return (
			<textarea
				ref={textarea => { this.textarea = textarea }}
				id="text-area-preview"
				rows={1}
				{...props}
			/>
		);
	}
}

export default TextAreaPreview;