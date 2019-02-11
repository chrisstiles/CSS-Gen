import React from 'react';
import Toggle from './input/Toggle';
import { updateGlobalState } from '../util/helpers';

class Settings extends React.Component {
  render() {
    return (
      <div id="settings-wrapper">
        <div id="generator-settings">
          <div className="bottom-title">Generator Settings</div>
          <div className="content">
            <div className="field-wrapper small">
                <Toggle
                  name="persistGeneratorState"
                  onChange={updateGlobalState}
                  label="Persist Generator"
                  checked={this.props.persistGeneratorState}
                />
            </div>
          </div>
        </div>
        {this.children}
      </div>
    );
  }
}

export default Settings;