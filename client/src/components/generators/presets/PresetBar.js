import React from 'react';
import Preset from './Preset';
import _ from 'underscore';

const PresetBar = ({ presets, onChange }) => {
  const presetComponents = _.map(presets, ({ styles, thumbnailStyles }, index) => {
    // Using the index as the key doesn't matter in this case 
    // because the list of pesets doesn't change
    const key = `preset${index}`;
    return (
      <Preset
        styles={styles}
        thumbnailStyles={thumbnailStyles}
        onChange={onChange}
        key={key}
      />
    );
  });

  return (
    <div id="preset-bar">
      {presetComponents}
    </div>
  );
}

export default PresetBar;