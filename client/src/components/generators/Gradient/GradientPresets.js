import React from 'react';
import PresetBar from '../presets/PresetBar';

const presets = [
	{
	  styles: {
	    type: 'linear',
	    palette: [
	    	{ pos: 0.00, color: 'rgba(238, 241, 11, 0)' },
	    	{ pos: 0.60, color: 'rgba(215, 128, 37, 0.71)'},
	    	{ pos: 1.00, color: '#7e20cf' }
	    ]
	  },
	  thumbnailStyles: { backgroundImage: 'linear-gradient(to left, rgba(238, 241, 11, 0) 0%, rgba(215, 128, 37, 0.71) 60%, #7e20cf 100%)' }
	}
];

const GradientPresets = ({ setPreset }) => {
	return (
		<PresetBar
		  presets={presets}
		  setPreset={setPreset}
		/>
	);
}

export default GradientPresets;