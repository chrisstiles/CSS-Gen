import React from 'react';
import Preset from './Preset';
import _ from 'underscore';

class PresetsWrapper extends React.PureComponent {
  render() {
    const presetComponents = _.map(this.props.presets, ({ ...props }, index) => {
      // Using the index as the key doesn't matter in this case 
      // because the list of pesets doesn't change
      const key = `preset${index}`;
      return (
        <Preset
          setPreset={this.props.setPreset}
          key={key}
          {...props}
        />
      );
    });

    return (
      <div id="presets-wrapper">
        <div className="bottom-title">Presets</div>
        <div className="presets">
          {presetComponents}
        </div>
      </div>
    );
  }
}

export default PresetsWrapper;