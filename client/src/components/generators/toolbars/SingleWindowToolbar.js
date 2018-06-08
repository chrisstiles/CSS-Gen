import React from 'react';
import Toolbar from './Toolbar';
import NumberInput from '../../input/NumberInput';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';

class SingleWindowToolbar extends React.Component {
  componentWillReceiveProps(newProps) {
    const activeElement = document.activeElement;

    // if (this.widthInput !== activeElement) {
      // this.widthInput.value = newProps.previewWidth;  
    // }

    // if (this.heightInput !== activeElement) {
      // this.heightInput.value = newProps.previewHeight;
    // }

    // console.log(newProps)
  }

  render() {
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
            inputRef={el => this.widthInput = el}
            name="width"
            onChange={this.props.onTextInputChange}
            onBlur={this.props.onTextInputBlur}
            handleTick={this.props.onTextInputTick}
            test={true}
          />
        </div>

        <div className="item input border">
          <label>Height:</label>
          <NumberInput 
            type="text"
            value={this.props.previewHeight}
            name="height"
            inputRef={el => this.heightInput = el}
            onChange={this.props.onTextInputChange}
            onBlur={this.props.onTextInputBlur}
            handleTick={this.props.onTextInputTick}
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