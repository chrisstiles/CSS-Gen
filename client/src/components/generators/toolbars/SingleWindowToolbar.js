import React from 'react';
import Toolbar from './Toolbar';
import NumberInput from '../../input/NumberInput';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';

class SingleWindowToolbar extends React.Component {
  render() {
    const { minWidth, maxWidth } = this.props.previewConstraints.width;
    const { minHeight, maxHeight } = this.props.previewConstraints.height;

    return (
      <Toolbar
        ref={toolbar => { this.toolbar = toolbar }}
      > 
        <div className="toolbar-title">Preview<br /> Settings</div>
        <div className="item input">
          <label>Width:</label>
          <NumberInput 
            type="text"
            value={this.props.previewWidth}
            name="width"
            onChange={this.props.onTextInputChange}
            // onBlur={this.props.onTextInputBlur}
            handleTick={this.props.onTextInputTick}
            min={minWidth}
            max={maxWidth}
          />
        </div>

        <div className="item input border">
          <label>Height:</label>
          <NumberInput 
            type="text"
            value={this.props.previewHeight}
            name="height"
            onChange={this.props.onTextInputChange}
            // onBlur={this.props.onTextInputBlur}
            handleTick={this.props.onTextInputTick}
            min={minHeight}
            max={maxHeight}
          />
        </div>

        <div className="item input border">
          <label>Background:</label>
          <ColorPicker
            backgroundColor={this.props.previewBackgroundColor}
            onChange={this.props.onColorPickerChange}
            ref={colorPicker => { this.colorPicker = colorPicker }}
            onOpen={this.props.onColorPickerOpen}
          />
        </div>

        <div className="item input border">
          <Toggle
            onChange={this.props.onPreviewCSSChange}
            label="Output CSS:"
            className="left"
            name="outputPreviewStyles"
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