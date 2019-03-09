import React from 'react';

const LoadingSpinner = props => {
	const { size = 65, color = '#4834d4' } = props;

	const spinnerStyle = { width: size, height: size };
	const circleStyle = { stroke: color }

	return (
		<svg 
			className="spinner" 
			style={spinnerStyle} 
			viewBox="0 0 66 66" 
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle 
				fill="none"
				style={circleStyle}
				strokeDashoffset="0" 
				strokeWidth="6" 
				strokeLinecap="round" 
				cx="33" 
				cy="33" 
				r="30"
			/>
		</svg>
	);
}

export default LoadingSpinner;