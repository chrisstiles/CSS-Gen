import React from 'react';
import Generator from '../../Generator';
import SingleWindowToolbar from '../toolbars/SingleWindowToolbar';
import SingleWindowPreview from '../previews/SingleWindowPreview';
import { cssToJs } from '../../../util/helpers';
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

    this.initialState = props.defaultStyles;

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
    this.previewWindow.reset();
    this.props.resetStyles(this.initialState);
  }

  handleToolbarTextChange(event) {
    const el = event.target;

    if (!isNaN(el.value)) {
      const type = el.getAttribute('name');

      var state = {};
      state[type] = el.value;
      state.previewCSS = this.generatePreviewCSS(state);

      this.setState(state);
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

    // this.toolbar.setDimensionInputs({ width, height });

    this.toolbar.widthInput.value = width;
    this.toolbar.heightInput.value = height;

    this.setState({ 
      width: width,
      height: height,
      previewCSS: this.generatePreviewCSS({ width, height }) 
    });
  }

  handleToolbarTick(up, type, shiftHeld) {
    this.previewWindow.handleTick(up, type, shiftHeld);
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

  handlePreviewWindowResize(newValue, type) {
    var width, height;
    if (newValue === undefined || type === undefined) {
      width = this.previewWindow.resizable.state.width;
      height = this.previewWindow.resizable.state.height;

      this.toolbar.widthInput.value = width;
      this.toolbar.heightInput.value = height;

    } else {
      
      var input;
      if (type === 'width') {
        input = this.toolbar.widthInput;
      } else {
        input = this.toolbar.heightInput;
      }

      input.value = newValue;

      width = this.toolbar.widthInput.value;
      height = this.toolbar.heightInput.value;
    }

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
        reset={this.reset}
        onTextInputChange={this.handleToolbarTextChange}
        onTextInputBlur={this.handleToolbarTextChange}
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
        ref={previewWindow => { this.previewWindow = previewWindow }}
        style={style}
        size={{ width: this.props.defaultPreviewSize.width, height: this.props.defaultPreviewSize.height }}
        onResize={this.handlePreviewWindowResize}
        id={this.props.previewID}
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