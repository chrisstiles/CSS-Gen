import React from 'react';

class ContentEditable extends React.Component {
	constructor(props) {
		super(props);

		this.generateHTML = this.generateHTML.bind(this);
	}

	generateHTML() {
		return this.props.content;
	}

	render() {
		var className = 'content-editable';

		if (this.props.className) {
			className += ` ${this.props.className}`;
		}

		return (
			<div
				className={className}
				style={this.props.style}
				contentEditable={true}
			>
				{this.generateHTML()}
			</div>
		);
	}
}

export default ContentEditable;