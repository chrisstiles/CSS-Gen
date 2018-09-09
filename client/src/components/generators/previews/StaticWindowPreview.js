import React from 'react';

class StaticWindowPreview extends React.Component {
	render() {
		const { isDefault, backgroundColor, children } = this.props;
		const wrapperStyle = isDefault ? {} : { backgroundColor };

		return (
			<div id="static-preview" style={wrapperStyle}>
				{!isDefault ? children : 
					<div id="checker-window">
						<div 
							className="overlay" 
							style={{ backgroundColor }} 
						/>
						<div className="content">
							{this.props.children}
						</div>
					</div>
				}
			</div>
		);
	}
}

export default StaticWindowPreview;