import React from 'react';
import Toolbar from './Toolbar';
import NumberInput from '../../input/NumberInput';
import ColorPicker from '../../input/ColorPicker';
import Toggle from '../../input/Toggle';
import { updateGlobalState } from '../../../util/helpers';

class SingleWindowToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, name) {
    const state = {};
    state[name] = value;

    this.props.onUpdate(state);
  }

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
          <label>Width</label>
          <NumberInput 
            type="text"
            value={width}
            name="width"
            onChange={this.handleChange}
            appendString="px"
            min={minWidth}
            max={maxWidth}
          />
        </div>

        <div className="item input border">
          <label>Height</label>
          <NumberInput 
            type="text"
            value={height}
            name="height"
            onChange={this.handleChange}
            appendString="px"
            min={minHeight}
            max={maxHeight}
          />
        </div>

        { !this.props.hideToolbarBackground ? 

        <div className="item input border">
          <label>Background</label>
          <ColorPicker
            name="backgroundColor"
            color={this.props.previewBackgroundColor}
            onChange={this.handleChange}
          />
        </div>

        : null }

        <div className="item input border">
          <Toggle
            name="outputPreviewStyles"
            onChange={updateGlobalState}
            label="Output CSS"
            className="left"
            checked={this.props.outputPreviewStyles}
          />
        </div>

        <div className="item input border">
          <Toggle
            name="showPreviewText"
            onChange={updateGlobalState}
            label="Preview Text"
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