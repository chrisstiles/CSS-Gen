import React from 'react';
import ColorPicker from './input/ColorPicker';
import Toggle from './input/Toggle';
import { updateGlobalState } from '../util/helpers';

class GeneratorSettings extends React.PureComponent {
  render() {
    const {
      canvasColor,
      updatePreview,
      globalState
    } = this.props;

    return (
      <div id="generator-settings-wrapper">
        <div id="generator-settings">
          <h4>Generator Settings</h4>
          <div className="content">
            <Toggle
              name="showTooltips"
              onChange={updateGlobalState}
              label="Tooltips"
              inline={true}
              checked={globalState.showTooltips}
            />
            <ColorPicker
              name="canvasColor"
              label="Canvas"
              color={canvasColor}
              inline={true}
              checkerButton={true}
              className="small-preview"
              onChange={updatePreview}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default GeneratorSettings;