import React from 'react';
import PresetsWrapper from '../presets/PresetsWrapper';

const presets = [
	{
	  generatorStyles: {
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
		generatorStyles: {
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
	},
	{
		generatorStyles: {
			type: 'radial',
			palette: [
				{ pos: 0.00, color: 'rgba(255, 239, 24, 0.56)' },
				{ pos: 0.09, color: 'rgba(255, 239, 24, 0.72)' },
				{ pos: 0.13, color: 'rgba(215, 128, 37, 0)' },
				{ pos: 0.25, color: 'rgba(215, 128, 37, 0.13)' },
				{ pos: 1.00, color: '#2081cf ' }
			],
			position: 'top right',
			positionX: 7,
			positionY: -6
		},
		thumbnailStyles: {
			background: 'radial-gradient(circle at top -6px right 7px, rgba(255, 239, 24, 0.56) 0%, rgba(255, 239, 24, 0.72) 9%, rgba(215, 128, 37, 0) 13%, rgba(215, 128, 37, 0.13) 25%, #2081cf 100%)'
		}
	}
];

presets.forEach(preset => {
	preset.generatorStyles.activeId = 1;
	preset.generatorStyles.palette = preset.generatorStyles.palette.map((stop, i) => {
		stop.id = i + 1;
		return stop;
	});
});

const GradientPresets = ({ setPreset }) => {
	return (
		<PresetsWrapper
		  presets={presets}
		  setPreset={setPreset}
		/>
	);
}

export default GradientPresets;