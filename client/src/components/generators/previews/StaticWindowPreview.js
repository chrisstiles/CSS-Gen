import React from 'react';

class StaticWindowPreview extends React.Component {
	render() {
		return (
			<div id="static-preview">
				<div 
					className="overlay" 
					style={{ backgroundColor: this.props.backgroundColor }} 
				/>
				<div className="content">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default StaticWindowPreview;