import React from 'react';
import PresetBar from '../presets/PresetBar';

const presets = [
  {
    styles: {
      topLeft: 0,
      topRight: 50,
      bottomLeft: 50,
      bottomRight: 0
    },
    thumbnailStyles: { borderRadius: '0px 10px' }
  },
  {
    styles: {
      topLeft: 50,
      topRight: 0,
      bottomLeft: 50,
      bottomRight: 0
    },
    thumbnailStyles: { borderRadius: '10px 0px 0px 10px' }
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