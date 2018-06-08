import React from 'react';
import Generator from '../../Generator';
import SingleWindowToolbar from '../toolbars/SingleWindowToolbar';
import SingleWindowPreview from '../previews/SingleWindowPreview';
import { cssToJs, numberInConstraints } from '../../../util/helpers';
import _ from 'underscore';

class SingleWindowGenerator extends React.Component {
  constructor(props) {
    super(props);

    const backgroundColor = props.defaultStyles.backgroundColor || '#ffffff';

    this.state = {
      backgroundColor: backgroundColor,
      width: props.defaultPreviewSize.width,
      height: props.defaultPreviewSize.height,
      previewCSS: ''
    };

    // Save original state for resetting generator
    this.initialState = _.extend({}, this.state, props.defaultStyles);

    // Preview window size constrains
    this.previewConstraints = props.previewConstraints || {
      width: { min: 200, max: 3000 },
      height: { min: 100, max: 3000 }
    };

    this.reset = this.reset.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.handleToolbarTextChange = this.handleToolbarTextChange.bind(this);
    this.handleToolbarTextBlur = this.handleToolbarTextBlur.bind(this);
    this.handleToolbarTick = this.handleToolbarTick.bind(this);
    this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
    this.handlePreviewWindowResize = this.handlePreviewWindowResize.bind(this);
    this.handlePreviewCSSChange = this.handlePreviewCSSChange.bind(this);
  }

  generatePreviewCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);

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
    this.setState(this.initialState);
    this.preview.reset();
    this.props.resetStyles(this.initialState);
  }

  handleToolbarTextChange(value, event) {
    const el = event.target;
    const type = el.getAttribute('name');
    // const { min, max } = this.preview.constraints[type];
    const state = {};

    state[type] = value;
    state.previewCSS = this.generatePreviewCSS(state);

    this.setState(state);
  }

  handleToolbarTextBlur(value, event) {
    const { maxWidth, maxHeight, minWidth, minHeight } = this.preview.resizable.props;
    const width = numberInConstraints(this.state.width, minWidth, maxWidth);
    const height = numberInConstraints(this.state.height, minHeight, maxHeight);

    this.setState({ 
      width: width,
      height: height,
      previewCSS: this.generatePreviewCSS({ width, height }) 
    });
  }

  handleToolbarTick(up, type, shiftHeld) {
    const step = shiftHeld ? 10 : 1;
    const { min, max } = this.preview.constraints[type];
    const state = {};

    var newValue = up ? this.state[type] + step : this.state[type] - step;

    newValue = numberInConstraints(newValue, min, max);
    state[type] = newValue;

    this.setState(state);
  }

  handleColorPickerChange(color) {
    this.setState({ 
      backgroundColor: color,
      previewCSS: this.generatePreviewCSS({ backgroundColor: color })
    });
  }

  handlePreviewCSSChange(value) {
    this.outputPreviewStyles = value;
    this.setState({ previewCSS: this.generatePreviewCSS() });
  }

  handlePreviewWindowResize(size) {
    const { width, height } = size;
    this.setState({ 
      width: width,
      height: height,
      previewCSS: this.generatePreviewCSS({ width, height }) 
    });
  }

  renderToolbar() {
    return (
      <SingleWindowToolbar
        previewWidth={this.state.width}
        previewHeight={this.state.height}
        previewBackgroundColor={this.state.backgroundColor}
        previewConstraints={this.previewConstraints}
        reset={this.reset}
        onTextInputChange={this.handleToolbarTextChange}
        // onTextInputBlur={this.handleToolbarTextBlur}
        onTextInputTick={this.handleToolbarTick}
        onColorPickerChange={this.handleColorPickerChange}
        onPreviewCSSChange={this.handlePreviewCSSChange}
        ref={toolbar => { this.toolbar = toolbar }}
      />
    );
  }

  renderPreview() {
    const style = {};
    const property = cssToJs(this.props.property);

    style[property] = this.props.generateCSS();
    style.backgroundColor = this.state.backgroundColor;

    return (
      <SingleWindowPreview
        ref={previewWindow => { this.preview = previewWindow }}
        style={style}
        id={this.props.previewID}
        size={{ width: this.state.width, height: this.state.height }}
        constraints={this.previewConstraints}
        onResize={this.handlePreviewWindowResize}
      >
        <div className="preview-text">
          Preview
          <span className="dimensions">{this.state.width}px x {this.state.height}px</span>
          <span className="instructions">You can drag and resize this window</span>
        </div>
      </SingleWindowPreview>
    );
  }

  render() {
    return (
      <Generator 
        title={this.props.title}
        className={this.props.className}
        property={this.props.property}
        heading={this.props.heading}
        renderToolbar={this.renderToolbar}
        renderPreview={this.renderPreview}
        previewCSS={this.state.previewCSS}
        renderInputs={this.props.renderInputs}
        generateCSS={this.props.generateCSS}
        reset={this.reset}
        browserPrefixes={this.props.browserPrefixes}
      />
    );
  }

}

export default SingleWindowGenerator;