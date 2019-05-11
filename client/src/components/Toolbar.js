import React from 'react';
import { mapObject } from 'underscore';
import NumberInput from './input/NumberInput';
import ColorPicker from './input/ColorPicker';

class Toolbar extends React.PureComponent {
  // Default generator preview windows will have:
  // width, height and optionally background
  renderDefaultPreviewSettings = () => {
    const { previewState, updatePreview } = this.props;
    if (!previewState) return;

    const previewComponents = mapObject(previewState, (value, key) => {
      // Only background color uses ColorPicker
      if (key.toLowerCase().includes('background')) {
        return (
          <ColorPicker
            name={key}
            key={key}
            className="small-preview"
            color={value}
            onChange={updatePreview}
          />
        );
      }
      // Capitalize first letter of key for label
      const label = key.charAt(0).toUpperCase() + key.slice(1) + ':';
      const className = ['small', key.toLowerCase()];

      // All other default preview settings use NumberInput
      return (
        <NumberInput
          type="text"
          name={key}
          key={key}
          className={className.join(' ')}
          value={value}
          label={label}
          appendString="px"
          min={80}
          max={3000}
          inline={true}
          onChange={updatePreview}
        />
      );
    });

    // Use an array to make sure components are
    // rendered in the correct order
    const { width, height, background } = previewComponents;
    const elements = [];

    if (background) elements.push(background);
    if (width) elements.push(width);
    if (height) elements.push(height);

    return elements;
  }

  render() {
    const { children, previewState, resetGenerator } = this.props;

    return (
      <div id="preview-toolbar">
        { previewState ? <h3>Preview</h3> : null }
        <div className="content">
          {this.renderDefaultPreviewSettings()}
          {children}
        </div>
        {resetGenerator ?
          <div
            className="button small reset"
            onClick={resetGenerator}
          >
            Reset
          </div>
          : null}
      </div>
    );
  }
}

export default Toolbar;