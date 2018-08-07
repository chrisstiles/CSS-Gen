import React from 'react';
import Generator from '../../Generator';
import SingleWindowToolbar from '../toolbars/SingleWindowToolbar';
import SingleWindowPreview from '../previews/SingleWindowPreview';
import { getGlobalDefaults, updateGlobalState } from '../../../util/helpers';
import _ from 'underscore';

class SingleWindowGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewCSS: this.generatePreviewCSS(props)
    };

    // Save original state for resetting generator
    this.initialState = _.extend({}, this.state, props.defaultState);
    this.initialState.hasResized = false;
    this.initialState.width = props.styles.width;

    // Add default background color
    if (!props.defaultState.backgroundColor) {
      this.initialState.backgroundColor = 'rgba(255, 255, 255, 1)';
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
    this.handleShowPreviewTextChange = this.handleShowPreviewTextChange.bind(this);
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
    // Revert global defaults
    const { showPreviewText, outputPreviewStyles } = getGlobalDefaults();
    updateGlobalState({ showPreviewText, outputPreviewStyles });

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

  handlePreviewCSSChange(outputPreviewStyles) {
    updateGlobalState({ outputPreviewStyles });
    this.setState({ previewCSS: this.generatePreviewCSS() });
  }

  handleShowPreviewTextChange(showPreviewText) {
    updateGlobalState({ showPreviewText });
  }

  handlePreviewWindowResize(size) {
    const { width, height } = size;
    const previewCSS = this.generatePreviewCSS({ width, height });
    
    this.props.generator.setState({ hasResized: true, width, height });
    this.setState({ previewCSS });
  }

  handleWrapperMount(wrapper) {
    this.generatorWrapper = wrapper;

    if (this.props.fullWidthPreview && !this.props.generator.state.hasResized) {
      const width = this.generatorWrapper.offsetWidth;
      const height = this.props.styles.height;

      this.handlePreviewWindowResize({ width, height });
    }
  }

  renderToolbar() {
    const { width, height, backgroundColor } = this.props.styles;
    const { outputPreviewStyles, showPreviewText } = this.props.globalState;

    return (
      <SingleWindowToolbar
        previewWidth={width}
        previewHeight={height}
        previewBackgroundColor={backgroundColor}
        previewConstraints={this.previewConstraints}
        outputPreviewStyles={outputPreviewStyles}
        showPreviewText={showPreviewText}
        reset={this.reset}
        onTextInputChange={this.handleToolbarTextChange}
        onColorPickerChange={this.handleColorPickerChange}
        onPreviewCSSChange={this.handlePreviewCSSChange}
        onShowPreviewTextChange={this.handleShowPreviewTextChange}
        ref={toolbar => { this.toolbar = toolbar }}
        renderPresets={this.props.renderPresets}
        hideToolbarBackground={this.props.hideToolbarBackground}
      />
    );
  }

  renderPreview() {
    const generatorStyles = this.props.generateCSS().styles || {};
    const { backgroundImage } = this.props.styles;

    if (backgroundImage) {
      generatorStyles.backgroundImage = `url('${backgroundImage}')`
    } else {
      generatorStyles.backgroundColor = this.props.styles.backgroundColor;
    }

    const resizeStyles = {};

    if (this.props.centerPreview || this.props.centerPreview === undefined) {
      resizeStyles.left = '50%';
      resizeStyles.marginLeft = -(this.initialState.width / 2);
    } else {
      resizeStyles.left = 0;
    }

    const { previewID, onFileDrop } = this.props;
    const { width, height } = this.props.styles;
    const { showPreviewText } = this.props.globalState;

    return (
      <SingleWindowPreview
        ref={previewWindow => { this.preview = previewWindow }}
        generatorStyles={generatorStyles}
        resizeStyles={resizeStyles}
        id={previewID}
        size={{ width, height }}
        constraints={this.previewConstraints}
        onResize={this.handlePreviewWindowResize}
        onFileDrop={onFileDrop}
      >
        { showPreviewText ?

          <div className="preview-text">
            Preview
            <span className="dimensions">{width}px x {height}px</span>
            <span className="instructions">You can drag and resize this window</span>
          </div>

        : null }
      </SingleWindowPreview>
    );
  }

  render() {
    return (
      <Generator 
        renderToolbar={this.renderToolbar}
        renderPreview={this.renderPreview}
        setPreset={this.setPreset}
        previewCSS={this.state.previewCSS}
        reset={this.reset}
        onWrapperMount={this.handleWrapperMount}
        outputPreviewStyles={this.props.globalState.outputPreviewStyles}
        preview={this}
        {...this.props}
      />
    );
  }

}

export default SingleWindowGenerator;