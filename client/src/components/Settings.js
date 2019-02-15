import React from 'react';
import Toggle from './input/Toggle';
import { getGlobalState, updateGlobalState } from '../util/helpers';

class Settings extends React.Component {
  render() {
    const { persistGeneratorState } = getGlobalState();

    return (
      <div id="settings-wrapper">
        <div id="generator-settings">
          <div className="bottom-title">Settings</div>
          <div className="content">
            <div className="field-wrapper">
                <Toggle
                  name="persistGeneratorState"
                  onChange={updateGlobalState}
                  label="Save generator state"
                  inline={true}
                  checked={persistGeneratorState}
                >
                  <p>Generator settings can be saved after you leave this page</p>
                </Toggle>
            </div>
          </div>
        </div>
        <div id="preview-settings">
          <div className="bottom-title">Preview Settings</div>
          <div className="content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;