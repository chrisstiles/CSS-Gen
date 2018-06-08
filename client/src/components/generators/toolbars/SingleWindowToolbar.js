import React from 'react';
import Toolbar from './Toolbar';
import NumberInput from '../../input/NumberInput';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';

class SingleWindowToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.reset = this.reset.bind(this);
  }

  reset(state) {
    this.colorPicker.reset();

    const width = state.width;
    const height = state.height;

    this.widthInput.value = width;
    this.heightInput.value = height;

    this.props.reset();
  }

  // setDimensionInputs({ width, height }) {
  //   if (width !== undefined) {
  //     this.widthInput.value = width;
  //   }

  //   if (height !== undefined) {
  //     this.heightInput.value = height;
  //   }
  // }

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
            defaultValue={this.props.previewWidth}
            inputRef={el => this.widthInput = el}
            name="width"
            onChange={this.props.onTextInputChange}
            onBlur={this.props.onTextInputBlur}
            handleTick={this.props.onTextInputTick}
          />
        </div>

        <div className="item input border">
          <label>Height:</label>
          <NumberInput 
            type="text"
            defaultValue={this.props.previewHeight}
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
            onClick={this.reset}
          >
            Reset
          </button>
        </div>
      </Toolbar>
    );
  }
}

export default SingleWindowToolbar;