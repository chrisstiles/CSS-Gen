import React from 'react';
import Generator from '../../Generator';
import SingleWindowToolbar from '../toolbars/SingleWindowToolbar';
import SingleWindowPreview from '../previews/SingleWindowPreview';
import _ from 'underscore';

class SingleWindowGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      outputPreviewStyles: false,
      previewCSS: ''
    };

    // Save original state for resetting generator
    this.initialState = _.extend({}, this.state, props.styles);

    // Add default background color
    if (!props.styles.backgroundColor) {
      const backgroundColor = 'rgba(255, 255, 255, 1)';
      this.initialState.backgroundColor = backgroundColor;
      props.generator.setState({ backgroundColor });
    }

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
    this.handleWrapperMount = this.handleWrapperMount.bind(this);
  }

  generatePreviewCSS(styles = {}) {
    const rules = _.extend({}, this.props.styles, styles);

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

    // Reset to full width rather than initial value
    if (this.props.fullWidthPreview && this.generatorWrapper) {
      const width = this.generatorWrapper.offsetWidth;
      state.width = width;
      this.initialState.width = width;
    } 

    this.setState(state);
    this.preview.reset();

    this.props.generator.setState(this.initialState);

    if (this.props.reset) {
      this.props.reset();
    }
  }

  setPreset(presetStyles) {
    const state = _.extend({}, this.initialState, presetStyles);
    this.props.generator.setState(state);
    this.preview.reset();

    const previewCSS = this.generatePreviewCSS(state);
    this.setState({ previewCSS });
  }

  handleToolbarTextChange(value, event) {
    const el = event.target;
    const type = el.getAttribute('name');
    const state = {};

    state[type] = value;
    
    this.props.generator.setState(state);

    const previewCSS = this.generatePreviewCSS(state);
    this.setState({ previewCSS });
  }

  handleColorPickerChange(color, name) {
    this.setState({ 
      previewCSS: this.generatePreviewCSS({ backgroundColor: color })
    });

    this.props.generator.setState({ backgroundColor: color });
  }

  handlePreviewCSSChange(value) {
    this.setState({ outputPreviewStyles: value, previewCSS: this.generatePreviewCSS() });
  }

  handlePreviewWindowResize(size) {
    const { width, height } = size;
    const previewCSS = this.generatePreviewCSS({ width, height });
    
    this.setState({ previewCSS });
    this.props.generator.setState({ width, height })
  }

  handleWrapperMount(wrapper) {
    this.generatorWrapper = wrapper;

    if (this.props.fullWidthPreview) {
      const width = this.generatorWrapper.offsetWidth;
      const height = this.props.styles.height;

      this.handlePreviewWindowResize({ width, height });
    }
  }

  renderToolbar() {
    return (
      <SingleWindowToolbar
        previewWidth={this.props.styles.width}
        previewHeight={this.props.styles.height}
        previewBackgroundColor={this.props.styles.backgroundColor}
        previewConstraints={this.previewConstraints}
        outputPreviewStyles={this.state.outputPreviewStyles}
        reset={this.reset}
        onTextInputChange={this.handleToolbarTextChange}
        onTextInputTick={this.handleToolbarTick}
        onColorPickerChange={this.handleColorPickerChange}
        onPreviewCSSChange={this.handlePreviewCSSChange}
        ref={toolbar => { this.toolbar = toolbar }}
        renderPresets={this.props.renderPresets}
        hideToolbarBackground={this.props.hideToolbarBackground}
      />
    );
  }

  renderPreview() {
    const style = this.props.generateCSS().styles || {};
    style.backgroundColor = this.props.styles.backgroundColor;

    if (this.props.centerPreview || this.props.centerPreview === undefined) {
      style.left = '50%';
      style.marginLeft = -(this.initialState.width / 2);
    } else {
      style.left = 0;
    }

    const { width, height } = this.props.styles;

    return (
      <SingleWindowPreview
        ref={previewWindow => { this.preview = previewWindow }}
        style={style}
        id={this.props.previewID}
        size={{ width, height }}
        constraints={this.previewConstraints}
        onResize={this.handlePreviewWindowResize}
      >
        <div className="preview-text">
          Preview
          <span className="dimensions">{width}px x {height}px</span>
          <span className="instructions">You can drag and resize this window</span>
        </div>
      </SingleWindowPreview>
    );
  }

  render() {
    return (
      <Generator 
        renderToolbar={this.renderToolbar}
        renderPreview={this.renderPreview}
        setPreset={this.setPreset}
        outputPreviewStyles={this.state.outputPreviewStyles}
        previewCSS={this.state.previewCSS}
        reset={this.reset}
        onWrapperMount={this.handleWrapperMount}
        preview={this}
        {...this.props}
      />
    );
  }

}

export default SingleWindowGenerator;