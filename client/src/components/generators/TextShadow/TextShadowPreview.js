import React from 'react';
import Preview from '../../Preview';
import { extend } from 'underscore';

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
		this.props.updateGenerator(state);
	}

	render() {
		const { canvasColor, updateGenerator, ...restProps } = this.props;
		const textAreaProps = extend({}, { ...restProps }, { onChange: this.handleChange.bind(this) });

		return (
			<Preview canvasColor={canvasColor}>
				<textarea
					ref={textarea => { this.textarea = textarea }}
					id="text-area-preview"
					spellCheck="false"
					rows={1}
					{...textAreaProps}
				/>
			</Preview>
		);
	}
}

export default TextAreaPreview;