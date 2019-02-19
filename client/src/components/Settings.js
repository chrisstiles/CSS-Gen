import React from 'react';
import NumberInput from './input/NumberInput';
import ColorPicker from './input/ColorPicker';
import Toggle from './input/Toggle';
import { mapObject } from 'underscore';
import { getGlobalState, updateGlobalState } from '../util/helpers';

class Settings extends React.PureComponent {
  // Default generator preview windows will have:
  // width, height and optionally background
  renderDefaultPreviewSettings = () => {
    if (!this.props.previewState) return;

    const previewState = mapObject(this.props.previewState, (value, key) => {
      // Capitalize first letter of key for label
      const label = key.charAt(0).toUpperCase() + key.slice(1);

      // Only background color uses ColorPicker
      if (key.toLowerCase().includes('background')) {
        return (
          <ColorPicker
            name={key}
            key={key}
            label={label}
            color={value}
            onChange={this.updateDefaultPreviewSettings}
          />
        );
      }

      // All other default preview settings use NumberInput
      return (
        <NumberInput
          type="text"
          name={key}
          key={key}
          value={value}
          label={label}
          appendString="px"
          min={80}
          max={3000}
          onChange={this.updateDefaultPreviewSettings}
        />
      );
    });

    // Use an array to make sure components are
    // rendered in the correct order
    const { width, height, background } = previewState;
    const elements = [];

    if (width) elements.push(width);
    if (height) elements.push(height);
    if (background) elements.push(background);

    return elements;
  }

  updateDefaultPreviewSettings = (value, name) => {
    
  }

  render() {
    const { persistGeneratorState } = getGlobalState();
    const { 
      canvasColor, 
      updatePreview, 
      children
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
              onChange={updatePreview}
            />
          </div>
        </div>
        <div id="preview-settings">
          <div className="bottom-title">Preview Settings</div>
          <div className="content">
            {children}
            {this.renderDefaultPreviewSettings()}
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;