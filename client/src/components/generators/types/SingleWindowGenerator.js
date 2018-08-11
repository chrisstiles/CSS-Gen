import React from 'react';
import Generator from '../../Generator';
import SingleWindowToolbar from '../toolbars/SingleWindowToolbar';
import SingleWindowPreview from '../previews/SingleWindowPreview';
import { getGlobalDefaults, updateGlobalState, getImageSize, getNativeImageSize, getDefaultState, getPersistedState } from '../../../util/helpers';
import _ from 'underscore';

class SingleWindowGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = getDefaultState({
      width: 300,
      height: 300,
      dragX: 0,
      dragY: 0,
      backgroundColor: '#ffffff'
    });

    _.extend(this.defaultState, props.previewStyles);

    // this.state = getPersistedState(this.defaultState);
    this.state = getPersistedState(this.defaultState, true);
    // this.state = _.extend({}, this.defaultState);
    this.state.previewCSS = this.generatePreviewCSS()

    // Save original state for resetting generator
    const { width, height, backgroundColor, image } = this.defaultState;
    // this.initialState = _.extend({}, this.state, { width, height, backgroundColor });

    if (image) {
      // Get original image dimensions
      getNativeImageSize(image).then(({ width, height }) => {
        _.extend(this.initialState, { width, height });
      });

      this.state.previewContentLoaded = false;
    } else {
      this.state.previewContentLoaded = true;
    }

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
    this.handlePreviewContentLoad = this.handlePreviewContentLoad.bind(this);
    this.handleToolbarTextChange = this.handleToolbarTextChange.bind(this);
    this.handleShowPreviewTextChange = this.handleShowPreviewTextChange.bind(this);
    this.handleColorPickerChange = this.handleColorPickerChange.bind(this);
    this.handlePreviewWindowResize = this.handlePreviewWindowResize.bind(this);
    this.handleFileDrop = this.handleFileDrop.bind(this);
    this.handlePreviewCSSChange = this.handlePreviewCSSChange.bind(this);
    this.handleWrapperMount = this.handleWrapperMount.bind(this);
    this.saveWrapperWidth = this.saveWrapperWidth.bind(this);
    this.handlePreviewDragStop = this.handlePreviewDragStop.bind(this);
  }

  generatePreviewCSS(styles = {}) {
    const rules = _.extend({}, this.state, styles);

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
      const { width, height } = this.defaultState;
      if (this.props.styles.image) {
        // Largest proportional dimensions that fit inside wrapper
        _.extend(generatorState, getImageSize(width, height, this.generatorWrapper));
      } else {
        generatorState.width = this.state.wrapperWidth;
      }

      _.extend(this.initialState, { width, height });
    }

    const previewCSS = this.generatePreviewCSS(this.defaultState);
    const previewState = _.extend({}, this.defaultState, { previewCSS });

    this.setState(previewState);
    this.preview.reset(generatorState.width);
    // this.props.generator.setState(generatorState);

    // Reset the generator styles
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

  handlePreviewContentLoad(value) {
    this.setState({ previewContentLoaded: value });
  }

  handleToolbarTextChange(value, event) {
    const el = event.target;
    const type = el.getAttribute('name');
    const state = {};

    state[type] = value;
    state.previewCSS = this.generatePreviewCSS(state);
    
    this.setState(state);

    // this.setState({ previewCSS });
  }

  handleColorPickerChange(color, name) {
    this.setState({ 
      backgroundColor: color,
      previewCSS: this.generatePreviewCSS({ backgroundColor: color })
    });

    // this.props.generator.setState({ backgroundColor: color });
  }

  handlePreviewCSSChange(outputPreviewStyles) {
    updateGlobalState({ outputPreviewStyles });
    this.setState({ previewCSS: this.generatePreviewCSS() });
  }

  handleShowPreviewTextChange(showPreviewText) {
    updateGlobalState({ showPreviewText });
  }

  handlePreviewWindowResize(data) {
    const { width, height, resizePosition } = data;
    const previewCSS = this.generatePreviewCSS({ width, height });
    
    // this.props.generator.setState({ hasResized: true, width, height });
    this.setState({ hasResized: true, width, height, previewCSS, resizePosition });
  }

  handleFileDrop(event) {
    const { onFileDrop } = this.props;
    // generator.setState({ hasResized: false });

    if (onFileDrop) {
      onFileDrop(event);
    }
  }

  saveWrapperWidth() {
    if (this.generatorWrapper) {
      const width = this.generatorWrapper.offsetWidth;
      this.setState({ wrapperWidth: width });
    }
  }

  handleWrapperMount(wrapper) {
    this.generatorWrapper = wrapper;

    // Save wrapper dimensions whenever it resizes
    this.saveWrapperWidth();
    window.addEventListener('resize', this.saveWrapperWidth, false);
    
    if (this.props.fullWidthPreview && !this.props.generator.state.hasResized) {
      const width = this.generatorWrapper.offsetWidth;
      const height = this.props.styles.height;

      this.handlePreviewWindowResize({ width, height });
    }
  }

  handlePreviewDragStop(event, data) {
    const { x, y } = data;
    // console.log(x, y)
    this.setState({ dragX: x, dragY: y });
  }

  renderToolbar() {
    const { width, height, backgroundColor } = this.state;
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
        previewContentLoaded={this.state.previewContentLoaded}
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
    const styles = _.extend({}, this.props.generatorStyles.styles);
    const { image, backgroundImage, backgroundColor, width, height } = this.state;
    const { dragX: x, dragY: y } = this.state;
    const { previewID, centerPreivew, fullWidthPreview } = this.props;
    const { showPreviewText } = this.props.globalState;

    if (image) {
      styles.image = image;
    } else {
      if (backgroundImage) {
        styles.backgroundImage = `url('${backgroundImage}')`
      } else {
        styles.backgroundColor = backgroundColor;
      }
    }

    
    // const position = {
    //   x: dragX,
    //   y: dragY
    // }
    // console.log(this.props.styles)
    
    // console.log(x, y)

    // this.props.defaultState

    return (
      <SingleWindowPreview
        ref={previewWindow => { this.preview = previewWindow }}
        styles={styles}
        id={previewID}
        size={{ width, height }}
        fullWidthPreview={fullWidthPreview}
        centerPreivew={centerPreivew}
        constraints={this.previewConstraints}
        previewContentLoaded={this.state.previewContentLoaded}
        wrapperWidth={this.state.wrapperWidth}
        onPreviewContentLoad={this.handlePreviewContentLoad}
        onResize={this.handlePreviewWindowResize}
        onFileDrop={this.handleFileDrop}
        onDragStop={this.handlePreviewDragStop}
        defaultPosition={{ x, y }}
        resizePosition={this.state.resizePosition}
        defaultWidth={this.defaultState.width}
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
        renderInputs = {this.props.renderInputs}
        renderToolbar={this.renderToolbar}
        renderPreview={this.renderPreview}
        setPreset={this.setPreset}
        reset={this.reset}
        onWrapperMount={this.handleWrapperMount}
        outputPreviewStyles={this.props.globalState.outputPreviewStyles}
        preview={this}
        // generatorStyles={this.props.styles}
        previewStyles={this.state}
        generatorStyles={this.props.generatorStyles}
      />
    );
  }

}

export default SingleWindowGenerator;