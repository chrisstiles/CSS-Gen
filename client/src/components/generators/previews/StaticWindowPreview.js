import React from 'react';

class StaticWindowPreview extends React.Component {
	render() {
		const { isDefault, backgroundColor, children } = this.props;

		return (
			<div id="static-preview">
				{!isDefault ? children : 
					<div id="checker-window">
						<div 
							className="overlay" 
							style={{ backgroundColor: this.props.backgroundColor }} 
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