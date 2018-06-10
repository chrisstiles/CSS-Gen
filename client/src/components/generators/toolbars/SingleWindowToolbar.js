import React from 'react';
import Toolbar from './Toolbar';
import NumberInput from '../../input/NumberInput';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';

class SingleWindowToolbar extends React.Component {
  render() {
    const constraints = this.props.previewConstraints;
    const minWidth = constraints.width.min;
    const maxWidth = constraints.width.max;
    const minHeight = constraints.height.min;
    const maxHeight = constraints.height.max;

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
            checked={this.props.outputPreviewStyles}
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