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
  { title: 'Radius', name: 'borderRadius', min: 0, max: 200 },
];

class BorderRadius extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // horizontalShift: 0,
      // verticalShift: 12,
      // blurRadius: 40,
      // spreadRadius: 0,
      // shadowOpacity: 0.15,
      // shadowColor: {
      //   hex: '#000000',
      //   rgb: {
      //     r: 0,
      //     g: 0,
      //     b: 0,
      //     a: 1
      //   }
      // },
      borderRadius: 10,
      outputCSS: '',
      previewCSS: '',
      previewWindow: {
        backgroundColor: '#4834d4',
        width: 300,
        height: 300
      }
      // inset: false
    };

    this.initialState = this.state;
    this.initialPreviewWindowState = this.state.previewWindow;

    this.generateCSS = this.generateCSS.bind(this);
    this.generatePreviewCSS = this.generatePreviewCSS.bind(this);
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
    this.handlePreviewCSSToggle = this.handlePreviewCSSToggle.bind(this);
  }

  componentWillMount() {
    const css = this.generateCSS();

    this.setState({ outputCSS: css });
    this.initialState.outputCSS = css;
  }

  componentDidMount() {
    this.generatePreviewCSS();
  }

  generateCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);
    const css = `${rules.borderRadius}px`;

    return css;
  }

  generatePreviewCSS(styles = {}) {
    const rules = _.extend({}, this.state.previewWindow, styles);

    var css;
    if (!this.outputPreviewStyles) {
      css = '';
    } else {
      css = `
        width: ${rules.width}px;
        height: ${rules.height}px;
        background-color: ${rules.backgroundColor};
      `;
    }

    return css.trim();
  }

  reset() {
    this.previewWindow.reset(); 
    this.previewWindowColorPicker.reset();

    const state = _.extend({}, this.initialState, { previewCSS: this.generatePreviewCSS(this.initialPreviewWindowState) });

    this.setState(state);

    const width = this.initialPreviewWindowState.width;
    const height = this.initialPreviewWindowState.height;

    this.widthInput.value = width;
    this.heightInput.value = height;
  }

  handleChange(cssRule, value) {
    var newState = {};
    newState[cssRule] = value;
    newState.outputCSS = this.generateCSS(newState);

    this.setState(newState);
  }

  handlePreviewWindowResize(newValue, type) {
    var width, height;
    if (newValue === undefined || type === undefined) {
      width = this.previewWindow.resizable.state.width;
      height = this.previewWindow.resizable.state.height;

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

      width = this.widthInput.value;
      height = this.heightInput.value;
    }

    this.setState({ 
      previewWindow: { ...this.state.previewWindow, width, height },
      previewCSS: this.generatePreviewCSS({ width, height }) 
    });
  }

  handleToolbarTextChange(event) {
    const el = event.target;

    if (!isNaN(el.value)) {
      const type = el.getAttribute('name');

      var state = {};
      state[type] = el.value;

      this.setState({ 
        previewWindow: { ...this.state.previewWindow, state },
        previewCSS: this.generatePreviewCSS(state) 
      });

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

    this.setState({ 
      previewWindow: { ...this.state.previewWindow, width, height },
      previewCSS: this.generatePreviewCSS({ width, height }) 
    });
  }

  handleToolbarTick(up, type, shiftHeld) {
    this.previewWindow.handleTick(up, type, shiftHeld);
  }

  handlePreviewWindowColorPickerChange(color) {
    this.setState({ 
      previewWindow: { ...this.state.previewWindow, backgroundColor: color },
      previewCSS: this.generatePreviewCSS({ backgroundColor: color })
    });
  }

  handleShadowColorPickerChange(color, colorObject) {
    const css = this.generateCSS({ color: colorObject });
    this.setState({ shadowColor: colorObject, outputCSS: css });
  }

  handleToggleChange(value, event) {
    const name = event.target.name;

    if (name === 'inset') {
      const css = this.generateCSS({ inset: value });
      this.setState({ outputCSS: css, inset: value });
    } else {
      const state = {};
      state[name] = value;

      this.setState(state);
    }
  }

  handlePreviewCSSToggle(value) {
    this.outputPreviewStyles = value;
    this.setState({ previewCSS: this.generatePreviewCSS() });
  }

  renderInputs() {
    return (
      <div>
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
        <div className="toolbar-title">Preview<br /> Settings</div>
        <div className="item input">
          <label>Width:</label>
          <NumberInput 
            type="text"
            defaultValue={this.initialPreviewWindowState.width}
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
            defaultValue={this.initialPreviewWindowState.height}
            name="height"
            inputRef={el => this.heightInput = el}
            onChange={this.handleToolbarTextChange}
            onBlur={this.handleToolbarTextBlur}
            handleTick={this.handleToolbarTick}
          />
        </div>

        <div className="item input border">
          <label>Background:</label>
          <ColorPicker
            backgroundColor={this.state.previewWindow.backgroundColor}
            onChange={this.handlePreviewWindowColorPickerChange}
            ref={colorPicker => { this.previewWindowColorPicker = colorPicker }}
          />
        </div>

        <div className="item input border">
          <Toggle
            onChange={this.handlePreviewCSSToggle}
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

  renderPreviewWindow() {
    return (
      <PreviewWindow
        ref={previewWindow => { this.previewWindow = previewWindow }}
        style={{ borderRadius: this.state.outputCSS,  backgroundColor: this.state.previewWindow.backgroundColor }}
        size={{ width: this.initialPreviewWindowState.width, height: this.initialPreviewWindowState.height }}
        handlePreviewWindowResize={this.handlePreviewWindowResize}
        id="border-radius-preview"
      >
        <div className="preview-text">
          Preview
          <span className="dimensions">{this.state.previewWindow.width}px x {this.state.previewWindow.height}px</span>
          <span className="instructions">You can drag and resize this window</span>
        </div>
      </PreviewWindow>
    );
  }

  render() {
    return (
      <Generator 
        title="CSS Border Radius Generator | CSS-GEN"
        className="border-radius"
        property="border-radius"
        heading="CSS Border Radius Generator"
        toolbar={this.renderToolbar()}
        previewWindow={this.renderPreviewWindow()}
        outputCSS={this.state.outputCSS}
        previewCSS={this.state.previewCSS}
        renderInputs={this.renderInputs}
      />
    );
  }
}

export default BorderRadius;