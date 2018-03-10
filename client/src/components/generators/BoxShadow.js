import React from 'react';
import Generator from '../Generator';
import Sliders from '../input/Sliders';
import Toolbar from './toolbars/Toolbar';
import PreviewWindow from '../PreviewWindow';
import NumberInput from '../input/NumberInput';
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

    this.defaultPreviewSize = { width: 400, height: 400 };
  }

  componentWillMount() {
    const css = this.generateCSS();

    this.setState({ style: css });
    this.initialState.style = css;
  }

  generateCSS(styles) {
    styles = styles || {};
    const rules = _.extend({}, this.state, styles);
    const css = `${rules.horizontalShift}px ${rules.verticalShift}px ${rules.blurRadius}px ${rules.spreadRadius}px rgba(0, 0, 0, ${rules.shadowOpacity})`;
    
    return css;
  }

  reset() {
    this.previewWindow.resetWindow(); 
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

  handlePreviewWindowResize() {
    const { width, height } = this.previewWindow.resizable.state;

    this.widthInput.value = width;
    this.heightInput.value = height;
  }

  handleToolbarTextChange(event) {
    const el = event.target;
    const type = el.getAttribute('name');

    var state = {};
    state[type] = el.value;

    this.previewWindow.resizable.setState(state);
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

  renderInputs() {
    return (
      <Sliders
        sliders={sliders}
        handleChange={this.handleChange}
        {...this.state}
      />
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
          />
        </div>

        <div className="item input">
          <label>Height:</label>
          <NumberInput 
            type="text"
            defaultValue={this.defaultPreviewSize.height}
            name="height"
            inputRef={el => this.heightInput = el}
            onChange={this.handleToolbarTextChange}
            onBlur={this.handleToolbarTextBlur}
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
        style={{ boxShadow: this.state.style }}
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