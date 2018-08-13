import React from 'react';

const LoadingSpinner = props => {
	const { width = 100, height = width, color = '#4834d4', borderWidth = 9 } = props;

	const divs = [];

	for (var i = 0; i <= 4; i++) {
		const style = {
			borderWidth,
			borderColor: `${color} transparent transparent transparent`
		}

		divs.push(<div key={i} style={style} />)
	}

	return (
		<div 
			className="loading-spinner"
			style={{ width, height }}
		>
	    {divs}
	  </div>
	);
}

export default LoadingSpinner;