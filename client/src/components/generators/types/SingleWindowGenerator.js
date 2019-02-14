import React from 'react';
import Generator from '../../Generator';
import SingleWindowToolbar from '../toolbars/SingleWindowToolbar';
import SingleWindowPreview from '../previews/SingleWindowPreview';
import FileDrop from '../../FileDrop';
import { getGlobalDefaults, updateGlobalState, getImageSize, getNativeImageSize, getState, startLoading } from '../../../util/helpers';
import _ from 'underscore';

class SingleWindowGenerator extends React.Component {
  constructor(props) {
    super(props);

    this.defaultState = _.extend({}, SingleWindowGenerator.defaultState, props.previewStyles);
    this.state = getState(this.defaultState, this.stateTypes, true);
    this.state.previewContentLoaded = !this.state.image;
    
    if (!this.state.previewContentLoaded) {
      startLoading('preview-content');
    }

    // Preview window size constrains
    this.previewConstraints = props.previewConstraints || {
      width: { min: 80, max: 3000 },
      height: { min: 80, max: 3000 }
    };
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWrapperResize);
  }

  generatePreviewCSS = (styles = {}) => {
    const rules = _.extend({}, this.state, styles);

    let css = `
      width: ${rules.width}px;
      height: ${rules.height}px;
    `;

    if (!this.props.hideToolbarBackground) {
      css += `background-color: ${rules.backgroundColor};`;
    }

    return css.trim();
  }

  reset = () => {
    // Revert global defaults
    const { showPreviewText, outputPreviewStyles } = getGlobalDefaults();
    updateGlobalState({ showPreviewText, outputPreviewStyles });

    this.setState(this.defaultState);
    this.preview.reset(this.defaultState.width);

    // Reset the generator styles
    this.props.updateGenerator(this.props.generatorDefaultState);
  }

  setPreset = (generatorStyles, previewStyles) => {
    const generatorState = _.extend({}, this.props.generatorDefaultState, generatorStyles);
    this.props.updateGenerator(generatorState);

    const previewState = _.extend({}, this.defaultState, previewStyles);
    this.setState(previewState);

    this.preview.reset(previewState.width);
  }

  handleFileDrop = (data) => {
    this.setState(data);
    this.preview.reset(data.width);
  }

  handleWrapperResize = () => {
    if (this.generatorWrapper) {
      const width = this.generatorWrapper.offsetWidth;
      this.setState({ wrapperWidth: width });

      // Reset to full width rather than initial value
      if (this.props.fullWidthPreview || this.defaultState.image) {
        const { width: defaultWidth, height: defaultHeight, image } = this.defaultState;

        if (image) {
          // Largest proportional dimensions that fit inside wrapper
          _.extend(this.defaultState, getImageSize(defaultWidth, defaultHeight, this.generatorWrapper));
        } else {
          _.extend(this.defaultState, { width });
        }
      }
    }
  }

  handleWrapperMount = (wrapper) => {
    this.generatorWrapper = wrapper;

    // Save wrapper dimensions whenever it resizes
    this.handleWrapperResize();
    window.addEventListener('resize', this.handleWrapperResize, false);

    const { fullWidthPreview } = this.props;
    const { image: defaultImage } = this.defaultState;
    const { image: currentImage, hasResized } = this.state;

    if (defaultImage || currentImage) {
      if (defaultImage) {
        // This generator has an image set by default
        getNativeImageSize(defaultImage)
          .then(({ width, height }) => {
            const size = getImageSize(width, height, wrapper);
            _.extend(this.defaultState, size);        
          })
          .catch(error => console.log(error));
      }
    } else if (fullWidthPreview && !hasResized) {
      const { width, height } = this.defaultState;
      this.setState({ width, height });
    }
  }

  handlePreviewUpdate = (data) => {
    this.setState(data);
  }

  renderToolbar = () => {
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
        onUpdate={this.handlePreviewUpdate}
        ref={toolbar => { this.toolbar = toolbar }}
        renderPresets={this.props.renderPresets}
        hideToolbarBackground={this.props.hideToolbarBackground}
      />
    );
  }

  renderPreview = () => {
    const styles = _.extend({}, this.props.generatorState.css.styles);
    const { image, backgroundImage, backgroundColor, width, height, hasResized, previewContentLoaded, resizeMarginAdjustment } = this.state;
    const { dragX: x, dragY: y } = this.state;
    const { previewID, centerPreview, fullWidthPreview, userImageAsBackground } = this.props;
    const { showPreviewText } = this.props.globalState;
    const settings = { previewID, centerPreview, fullWidthPreview, userImageAsBackground, showPreviewText }

    if (image) {
      styles.image = image;
    } else {
      if (backgroundImage) {
        styles.backgroundImage = `url('${backgroundImage}')`
      } else {
        styles.backgroundColor = backgroundColor;
      }
    }

    return (
      <SingleWindowPreview
        ref={previewWindow => { this.preview = previewWindow }}
        styles={styles}
        size={{ width, height }}
        resizeMarginAdjustment={resizeMarginAdjustment}
        constraints={this.previewConstraints}
        previewContentLoaded={previewContentLoaded}
        hasResized={hasResized}
        wrapperWidth={this.state.wrapperWidth}
        onUpdate={this.handlePreviewUpdate}
        position={{ x, y }}
        resizePosition={this.state.resizePosition}
        defaultWidth={this.defaultState.width}
        reset={this.reset}
        {...settings}
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
    const previewState = _.extend({}, this.state, { previewCSS: this.generatePreviewCSS() });
    const props = _.extend({}, this.props, {
      previewState,
      renderPreview: this.renderPreview,
      renderToolbar: this.renderToolbar,
      setPreset: this.setPreset,
      onWrapperMount: this.handleWrapperMount
    });
    
    return (
      <div>
        <FileDrop onFileDrop={this.handleFileDrop} />
        <Generator {...props} />
      </div>
    );
  }

}

export default SingleWindowGenerator;

SingleWindowGenerator.defaultState = {
  width: 300,
  height: 300,
  dragX: 0,
  dragY: 0,
  backgroundColor: '#ffffff',
  hasResized: false,
  resizePosition: { x: 0, y: 0 },
  image: null,
  resizeMarginAdjustment: 0
};

SingleWindowGenerator.stateTypes = {
  width: Number,
  height: Number,
  dragX: Number,
  dragY: Number,
  backgroundColor: String,
  hasResized: Boolean,
  resizePosition: { x: Number, y: Number },
  image: null,
  resizeMarginAdjustment: Number
};