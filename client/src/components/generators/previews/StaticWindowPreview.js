import React from 'react';

class StaticWindowPreview extends React.Component {
	render() {
		return (
			<div id="static-preview">{this.props.children}</div>
		);
	}
}

export default StaticWindowPreview;