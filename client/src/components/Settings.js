import React from 'react';
import Toggle from './input/Toggle';
import { updateGlobalState } from '../util/helpers';

class Settings extends React.Component {
  render() {
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
                  checked={this.props.persistGeneratorState}
                >
                  <p>Generator settings can be saved after you leave this page</p>
                </Toggle>
            </div>
          </div>
        </div>
        {this.children}
      </div>
    );
  }
}

export default Settings;