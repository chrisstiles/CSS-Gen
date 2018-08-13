import React from 'react';
import PresetBar from '../presets/PresetBar';

const presets = [
  {
    generatorStyles: {
      topLeft: 0,
      topRight: 50,
      bottomLeft: 50,
      bottomRight: 0
    },
    thumbnailStyles: { borderRadius: '0px 10px' }
  },
  {
    generatorStyles: {
      topLeft: 50,
      topRight: 0,
      bottomLeft: 50,
      bottomRight: 0
    },
    thumbnailStyles: { borderRadius: '10px 0px 0px 10px' }
  },
  {
    generatorStyles: {
      radius: 50,
      units: '%',
      topLeft: 50,
      topLeftUnits: '%',
      topRight: 50,
      topRightUnits: '%',
      bottomLeft: 50,
      bottomLeftUnits: '%',
      bottomRight: 50,
      bottomRightUnits: '%',
    },
    thumbnailStyles: { borderRadius: '50%' }
  }
];

const BorderRadiusPresets = ({ setPreset }) => {
  return (
    <PresetBar
      presets={presets}
      setPreset={setPreset}
    />
  );
}

export default BorderRadiusPresets;