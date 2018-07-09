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
	  thumbnailStyles: { 
	  	backgroundImage: 'linear-gradient(to left, rgba(238, 241, 11, 0) 0%, rgba(215, 128, 37, 0.71) 60%, #7e20cf 100%)',
	  	backgroundColor: 'transparent'
	  }
	},
	{
		styles: {
		  type: 'radial',
		  palette: [
		  	{ pos: 0.00, color: '#f1b50b' },
		  	{ pos: 0.40, color: '#d78025'},
		  	{ pos: 0.69, color: 'rgba(208, 2, 27, 0.8)' },
		  	{ pos: 1.00, color: '#cf206e'}
		  ]
		},
		thumbnailStyles: { 
			backgroundImage: 'radial-gradient(circle at center, #f1b50b 0%, #d78025 40%, rgba(208, 2, 27, 0.8) 69%, #cf206e 100%)',
			backgroundColor: 'transparent'
		}
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