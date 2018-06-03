import React from 'react';
import Generator from '../Generator';
import Sliders from '../input/Sliders';
import Toolbar from './toolbars/Toolbar';
import PreviewWindow from '../PreviewWindow';
import NumberInput from '../input/NumberInput';
import Toggle from '../input/Toggle';
import ColorPicker from '../input/ColorPicker';
import _ from 'underscore';

const sliders = [
  { title: 'Horizontal Shift', name: 'horizontalShift', min: -200, max: 200 },
  { title: 'Vertical Shift', name: 'verticalShift', min: -200, max: 200 },
  { title: 'Blur Radius', name: 'blurRadius', min: 0, max: 100 },
  { title: 'Spread Radius', name: 'spreadRadius', min: 0, max: 100 },
  { title: 'Shadow Opacity', name: 'shadowOpacity', min: 0, max: 1, step: .01 }
];

class BoxShadow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      horizontalShift: 0,
      verticalShift: 8,
      shadowColor: '#000',
      blurRadius: 28,
      spreadRadius: 0,
      shadowOpacity: 0.25,
      shadowColor: {
        hex: '#000000',
        rgb: {
          r: 0,
          g: 0,
          b: 0,
          a: 1
        }
      },
      backgroundColor: 'rgba(255, 255, 255, 1)',
      inset: false,
      style: ''
    };

    this.initialState = this.state;

    this.generateCSS = this.generateCSS.bind(this);
    this.reset = this.reset.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handlePreviewWindowResize = this.handlePreviewWindowResize.bind(this);
    this.handleToolbarTextChange = this.handleToolbarTextChange.bind(this);
    this.handleToolbarTextBlur = this.handleToolbarTextBlur.bind(this);
    this.handleToolbarTick = this.handleToolbarTick.bind(this);
    this.handlePreviewWindowColorPickerChange = this.handlePreviewWindowColorPickerChange.bind(this);
    this.handleShadowColorPickerChange = this.handleShadowColorPickerChange.bind(this);
    this.handleToggleChange = this.handleToggleChange.bind(this);

    this.defaultPreviewSize = { width: 400, height: 400 };
  }

  componentWillMount() {
    const css = this.generateCSS();

    this.setState({ style: css });
    this.initialState.style = css;
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);
    const color = rules.color === undefined ? this.state.shadowColor.rgb : rules.color.rgb;

    var css = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${rules.spreadRadius}px rgba(${color.r}, ${color.g}, ${color.b}, ${rules.shadowOpacity})`;

    if ((rules.inset !== undefined && rules.inset) || (rules.inset === undefined && this.state.inset)) {
      css = `inset ${css}`;
    }

    return css;
  }

  reset() {
    this.previewWindow.reset(); 
    this.previewWindowColorPicker.reset();
    this.shadowColorPicker.reset();
    this.setState(this.initialState);

    const width = this.defaultPreviewSize.width;
    const height = this.defaultPreviewSize.height;

    this.widthInput.value = width;
    this.heightInput.value = height;
  }

  handleChange(cssRule, value) {
    var newState = {};
    newState[cssRule] = value;
    newState.style = this.generateCSS(newState);

    this.setState(newState);
  }

  handlePreviewWindowResize(newValue, type) {

    if (newValue === undefined || type === undefined) {

      const { width, height } = this.previewWindow.resizable.state;

      this.widthInput.value = width;
      this.heightInput.value = height;

    } else {
      
      var input;
      if (type === 'width') {
        input = this.widthInput;
      } else {
        input = this.heightInput;
      }

      input.value = newValue;

    }
    
  }

  handleToolbarTextChange(event) {
    const el = event.target;

    if (!isNaN(el.value)) {
      const type = el.getAttribute('name');

      var state = {};
      state[type] = el.value;

      this.previewWindow.resizable.setState(state);
    }

  }

  handleToolbarTextBlur(event) {
    const { minWidth, minHeight, maxWidth, maxHeight } = this.previewWindow.resizable.props;
    var { width, height } = this.previewWindow.resizable.state;

    if ( width < minWidth ) width = minWidth;
    if ( height < minHeight ) height = minHeight;

    if ( width > maxWidth ) width = maxWidth;
    if ( height > maxHeight ) height = maxHeight;

    this.widthInput.value = width;
    this.heightInput.value = height;
  }

  handleToolbarTick(up, type) {
    this.previewWindow.handleTick(up, type);
  }

  handlePreviewWindowColorPickerChange(color) {
    this.setState({ backgroundColor: color });
  }

  handleShadowColorPickerChange(color, colorObject) {
    const css = this.generateCSS({ color: colorObject });
    this.setState({ shadowColor: colorObject, style: css });
  }

  handleToggleChange(value) {
    const css = this.generateCSS({ inset: value });
    this.setState({ style: css, inset: value });
  }

  renderInputs() {
    return (
      <div>
        <Toggle
          onChange={this.handleToggleChange}
          label="Inset"
          className=""
        />
        <div className="field-wrapper">
          <ColorPicker
            backgroundColor={this.state.shadowColor}
            disableAlpha={true}
            onChange={this.handleShadowColorPickerChange}
            ref={colorPicker => { this.shadowColorPicker = colorPicker }}
          />
        </div>
        <Sliders
          sliders={sliders}
          handleChange={this.handleChange}
          {...this.state}
        />
      </div>
    );
  }

  renderToolbar() {
    return (
      <Toolbar
        ref={toolbar => { this.toolbar = toolbar }}
      > 
        <div className="toolbar-title">Preview<br /> Window</div>
        <div className="item input">
          <label>Width:</label>
          <NumberInput 
            type="text"
            defaultValue={this.defaultPreviewSize.width}
            inputRef={el => this.widthInput = el}
            name="width"
            onChange={this.handleToolbarTextChange}
            onBlur={this.handleToolbarTextBlur}
            handleTick={this.handleToolbarTick}
          />
        </div>

        <div className="item input border">
          <label>Height:</label>
          <NumberInput 
            type="text"
            defaultValue={this.defaultPreviewSize.height}
            name="height"
            inputRef={el => this.heightInput = el}
            onChange={this.handleToolbarTextChange}
            onBlur={this.handleToolbarTextBlur}
            handleTick={this.handleToolbarTick}
          />
        </div>

        <div className="item">
          <ColorPicker
            backgroundColor={this.state.backgroundColor}
            onChange={this.handlePreviewWindowColorPickerChange}
            ref={colorPicker => { this.previewWindowColorPicker = colorPicker }}
          />
        </div>

        <div className="right">
          <button
            className="button"
            onClick={this.reset}
          >
            Reset Window
          </button>
        </div>
      </Toolbar>
    );
  }

  renderPreviewWindow() {
    return (
      <PreviewWindow
        ref={previewWindow => { this.previewWindow = previewWindow }}
        style={{ boxShadow: this.state.style, backgroundColor: this.state.backgroundColor }}
        size={{ width: 400, height: 400 }}
        handlePreviewWindowResize={this.handlePreviewWindowResize}
      />
    );
  }

  render() {
    return (
      <Generator 
        title="CSS Box Shadow Generator | CSS-GEN"
        property="box-shadow"
        heading="CSS Box Shadow Generator"
        toolbar={this.renderToolbar()}
        previewWindow={this.renderPreviewWindow()}
        generateCSS={this.generateCSS}
        renderInputs={this.renderInputs}
      />
    );
  }
}

export default BoxShadow;