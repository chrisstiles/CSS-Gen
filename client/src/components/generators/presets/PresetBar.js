import React from 'react';
import Preset from './Preset';
import _ from 'underscore';

class PresetBar extends React.Component {
  render() {
    const presetComponents = _.map(this.props.presets, ({ styles, thumbnailStyles }, index) => {
      // Using the index as the key doesn't matter in this case 
      // because the list of pesets doesn't change
      const key = `preset${index}`;
      return (
        <Preset
          styles={styles}
          thumbnailStyles={thumbnailStyles}
          setPreset={this.props.setPreset}
          key={key}
        />
      );
    });

    return (
      <div id="preset-bar" className="subheader">
        {presetComponents}
      </div>
    );
  }
}

export default PresetBar;