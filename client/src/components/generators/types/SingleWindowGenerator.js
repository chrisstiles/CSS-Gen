import React from 'react';
import Generator from '../../Generator';
import SingleWindowToolbar from '../toolbars/SingleWindowToolbar';
import SingleWindowPreview from '../previews/SingleWindowPreview';
import { getGlobalDefaults, updateGlobalState, getImageSize, getNativeImageSize } from '../../../util/helpers';
import _ from 'underscore';

class SingleWindowGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previewCSS: this.generatePreviewCSS(props)
    };

    console.log(props.defaultState)

    setTimeout(() => {
      console.log(this.props.defaultState)
    }, 300);

    // Save original state for resetting generator
    // this.initialState = _.extend({}, this.state, props.defaultState);
    const { width, height, backgroundColor, image } = props.defaultState;
    this.initialState = _.extend({}, this.state, { width, height, backgroundColor });

    if (image) {
      // Get original image dimensions
      getNativeImageSize(image).then(({ width, height }) => {
        _.extend(this.initialState, { width, height });
      });
    }
    // this.initialState.hasResized = false;

    // Add default background color
    // if (!props.defaultState.backgroundColor) {
      // this.initialState.backgroundColor = 'rgba(255, 255, 255, 1)';
    // }

    // Preview window size constrains
    this.previewConstraints = props.previewConstraints || {
      width: { min: 200, max: 3000 },
      height: { min: 100, max: 3000 }
    };

    // Save wrapper dimensions
    this.state.wrapperWidth = 800;

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
    this.saveWrapperWidth = this.saveWrapperWidth.bind(this);
    this.handlePreviewDrag = this.handlePreviewDrag.bind(this);
  }

  generatePreviewCSS(styles = {}) {
    const rules = _.extend({}, this.props.styles, styles);

    var css = `
      width: ${rules.width}px;
      height: ${rules.height}px;
    `;

    if (!this.props.hideToolbarBackground) {
      css += `background-color: ${rules.backgroundColor};`;
    }

    return css.trim();
  }

  reset() {
    // Revert global defaults
    const { showPreviewText, outputPreviewStyles } = getGlobalDefaults();
    updateGlobalState({ showPreviewText, outputPreviewStyles });
    
    const generatorState = _.extend({}, this.props.defaultState);

    // Reset to full width rather than initial value
    if (this.props.fullWidthPreview && this.generatorWrapper) {
      const { width, height } = this.initialState;
      if (this.props.styles.image) {
        // Largest proportional dimensions that fit inside wrapper
        _.extend(generatorState, getImageSize(width, height, this.generatorWrapper));
      } else {
        generatorState.width = this.state.wrapperWidth;
      }

      _.extend(this.initialState, { width, height });
    }

    const previewCSS = this.generatePreviewCSS(this.initialState);
    const previewState = _.extend({}, this.initialState, { previewCSS });

    this.setState(previewState);
    this.preview.reset(generatorState.width);
    this.props.generator.setState(generatorState);

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

  saveWrapperWidth() {
    if (this.generatorWrapper) {
      const width = this.generatorWrapper.offsetWidth;
      this.setState({ wrapperWidth: width });
    }
  }

  handleWrapperMount(wrapper) {
    this.generatorWrapper = wrapper;
    getImageSize()

    // Save wrapper dimensions whenever it resizes
    this.saveWrapperWidth();
    window.addEventListener('resize', this.saveWrapperWidth, false);
    
    if (this.props.fullWidthPreview && !this.props.generator.state.hasResized) {
      const width = this.generatorWrapper.offsetWidth;
      const height = this.props.styles.height;

      this.handlePreviewWindowResize({ width, height });
    }
  }

  handlePreviewDrag(event, data) {
    const { x, y } = data;
    this.props.generator.setState({ dragX: x, dragY: y });
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
    const { image, backgroundImage, backgroundColor, dragX, dragY } = this.props.styles;

    if (image) {
      generatorStyles.image = image;
    } else {
      if (backgroundImage) {
        generatorStyles.backgroundImage = `url('${backgroundImage}')`
      } else {
        generatorStyles.backgroundColor = backgroundColor;
      }
    }

    const { previewID, onFileDrop } = this.props;
    const { width, height } = this.props.styles;
    const { showPreviewText } = this.props.globalState;
    const defaultPosition = {
      x: dragX,
      y: dragY
    }

    return (
      <SingleWindowPreview
        ref={previewWindow => { this.preview = previewWindow }}
        generatorStyles={generatorStyles}
        id={previewID}
        size={{ width, height }}
        constraints={this.previewConstraints}
        onResize={this.handlePreviewWindowResize}
        onFileDrop={onFileDrop}
        onDrag={this.handlePreviewDrag}
        defaultPosition={defaultPosition}
        reset={this.reset}
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