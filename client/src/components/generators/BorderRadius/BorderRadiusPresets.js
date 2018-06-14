import React from 'react';
import PresetBar from '../presets/PresetBar';

const presets = [
  { styles: { borderRadius: 10 }, thumbnailStyles: { borderRadius: 10 } }
];

const BorderRadiusPresets = ({ onChange }) => {
  return (
    <PresetBar
      presets={presets}
      onChange={onChange}
    />
  );
}

export default BorderRadiusPresets;