import React from 'react';
import Generator from '../../Generator';
import SingleWindowToolbar from '../toolbars/SingleWindowToolbar';
import SingleWindowPreview from '../previews/SingleWindowPreview';
import _ from 'underscore';

class SingleWindowGenerator extends React.Component {
  constructor(props) {
    super(props);

    const backgroundColor = props.styles.backgroundColor || 'rgba(255, 255, 255, 1)';

    this.state = {
      backgroundColor: backgroundColor,
      width: props.styles.width,
      height: props.styles.height,
      outputPreviewStyles: false,
      previewCSS: ''
    };

    // Save original state for resetting generator
    this.initialState = _.extend({}, this.state, props.styles);

    // Preview window size constrains
    this.previewConstraints = props.previewConstraints || {
      width: { min: 200, max: 3000 },
      height: { min: 100, max: 3000 }
    };

    this.reset = this.reset.bind(this);
    this.renderToolbar = this.renderToolbar.bind(this);
    this.renderPreview = this.renderPreview.bind(this);
    this.setPreset = this.setPreset.bind(this);
    this.handleToolbarTextChange = this.handleToolbarTextChange.bind(this);
    this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
    this.handlePreviewWindowResize = this.handlePreviewWindowResize.bind(this);
    this.handlePreviewCSSChange = this.handlePreviewCSSChange.bind(this);
  }

  generatePreviewCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);

    const css = `
      width: ${rules.width}px;
      height: ${rules.height}px;
      background-color: ${rules.backgroundColor};
    `;

    return css.trim();
  }

  reset() {
    const previewCSS = this.generatePreviewCSS(this.initialState);
    const state = _.extend({}, this.initialState, { previewCSS });

    this.setState(state);
    this.preview.reset();

    this.props.owner.setState(this.initialState);

    if (this.props.reset) {
      this.props.reset();
    }
  }

  setPreset(presetStyles) {
    const state = _.extend({}, this.initialState, presetStyles);
    this.props.owner.setState(state);
    this.preview.reset();

    const previewCSS = this.generatePreviewCSS(state);
    this.setState({ previewCSS });
  }

  handleToolbarTextChange(value, event) {
    const el = event.target;
    const type = el.getAttribute('name');
    const state = {};

    state[type] = value;
    
    this.props.owner.setState(state);

    const previewCSS = this.generatePreviewCSS(state);
    this.setState({ previewCSS });
  }

  handleColorPickerChange(color, name) {
    this.setState({ 
      backgroundColor: color,
      previewCSS: this.generatePreviewCSS({ backgroundColor: color })
    });
  }

  handlePreviewCSSChange(value) {
    this.setState({ outputPreviewStyles: value, previewCSS: this.generatePreviewCSS() });
  }

  handlePreviewWindowResize(size) {
    const { width, height } = size;
    const previewCSS = this.generatePreviewCSS({ width, height });
    
    this.setState({ previewCSS });
    this.props.owner.setState({ width, height })
  }

  renderToolbar() {
    return (
      <SingleWindowToolbar
        previewWidth={this.props.styles.width}
        previewHeight={this.props.styles.height}
        previewBackgroundColor={this.state.backgroundColor}
        previewConstraints={this.previewConstraints}
        outputPreviewStyles={this.state.outputPreviewStyles}
        reset={this.reset}
        onTextInputChange={this.handleToolbarTextChange}
        onTextInputTick={this.handleToolbarTick}
        onColorPickerChange={this.handleColorPickerChange}
        onPreviewCSSChange={this.handlePreviewCSSChange}
        ref={toolbar => { this.toolbar = toolbar }}
        renderPresets={this.props.renderPresets}
      />
    );
  }

  renderPreview() {
    const style = this.props.generateCSS().styles || {};
    style.backgroundColor = this.state.backgroundColor;

    return (
      <SingleWindowPreview
        ref={previewWindow => { this.preview = previewWindow }}
        style={style}
        id={this.props.previewID}
        size={{ width: this.props.styles.width, height: this.props.styles.height }}
        constraints={this.previewConstraints}
        onResize={this.handlePreviewWindowResize}
      >
        <div className="preview-text">
          Preview
          <span className="dimensions">{this.props.styles.width}px x {this.props.styles.height}px</span>
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
        heading={this.props.heading}
        renderToolbar={this.renderToolbar}
        renderPreview={this.renderPreview}
        renderPresets={this.props.renderPresets}
        setPreset={this.setPreset}
        outputPreviewStyles={this.state.outputPreviewStyles}
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