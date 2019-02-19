import React from 'react';
import Toggle from './input/Toggle';
import ColorPicker from './input/ColorPicker';
import { getGlobalState, updateGlobalState } from '../util/helpers';

class Settings extends React.PureComponent {
  render() {
    const { persistGeneratorState } = getGlobalState();
    const { 
      canvasColor, 
      updateGenerator, 
      children,
    } = this.props;

    return (
      <div id="settings-wrapper">
        <div id="generator-settings">
          <div className="bottom-title">Settings</div>
          <div className="content">
            <Toggle
              name="persistGeneratorState"
              onChange={updateGlobalState}
              label="Save generator state"
              inline={true}
              checked={persistGeneratorState}
            >
              <p>Generator settings can be saved after you leave this page</p>
            </Toggle>
            <ColorPicker
              name="canvasColor"
              label="Canvas background"
              color={canvasColor}
              inline={true}
              transparentButton={true}
              className="small-preview"
              onChange={updateGenerator}
            />
          </div>
        </div>
        <div id="preview-settings">
          <div className="bottom-title">Preview Settings</div>
          <div className="content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;