import React from 'react';
import Toolbar from './Toolbar';
import NumberInput from '../../input/NumberInput';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';

class SingleWindowToolbar extends React.Component {
  render() {
    const { previewConstraints: constraints, previewContentLoaded, previewWidth, previewHeight } = this.props;
    const { min: minWidth, max: maxWidth } = constraints.width;
    const { min: minHeight, max: maxHeight } = constraints.height;

    const width = previewContentLoaded ? previewWidth : '';
    const height = previewContentLoaded ? previewHeight : '';

    return (
      <Toolbar
        ref={toolbar => { this.toolbar = toolbar }}
      > 
        <div className="toolbar-title">Preview<br /> Settings</div>
        <div className="item input">
          <label>Width:</label>
          <NumberInput 
            type="text"
            value={width}
            name="width"
            onChange={this.props.onTextInputChange}
            min={minWidth}
            max={maxWidth}
          />
        </div>

        <div className="item input border">
          <label>Height:</label>
          <NumberInput 
            type="text"
            value={height}
            name="height"
            onChange={this.props.onTextInputChange}
            min={minHeight}
            max={maxHeight}
          />
        </div>

        { !this.props.hideToolbarBackground ? 

        <div className="item input border">
          <label>Background:</label>
          <ColorPicker
            color={this.props.previewBackgroundColor}
            onChange={this.props.onColorPickerChange}
          />
        </div>

        : null }

        <div className="item input border">
          <Toggle
            onChange={this.props.onPreviewCSSChange}
            label="Output CSS:"
            className="left"
            checked={this.props.outputPreviewStyles}
          />
        </div>

        <div className="item input border">
          <Toggle
            onChange={this.props.onShowPreviewTextChange}
            label="Preview Text:"
            className="left"
            checked={this.props.showPreviewText}
          />
        </div>

        <div className="right">
          <button
            className="button"
            onClick={this.props.reset}
          >
            Reset
          </button>
        </div>
      </Toolbar>
    );
  }
}

export default SingleWindowToolbar;