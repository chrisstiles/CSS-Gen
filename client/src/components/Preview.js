import React from 'react';
import FileDrop from './FileDrop';
import LoadingSpinner from './LoadingSpinner';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';
import { extend, isEqual } from 'underscore';
import tinycolor from 'tinycolor2';
import { 
  getImageSize, 
  getNaturalImageSize,
  addNotification, 
  getNotificationTypes,
  startLoading,
  finishLoading
} from '../util/helpers';

class PreviewWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = { wrapperStyle: {} }

    this.hasLoaded = !props.previewState.image;
    this.isResizing = false;
    this.resizePosition = extend({}, props.previewState.resizePosition);

    this.constraints = {
      min: { width: 80, height: 80 },
      max: { width: 3000, height: 3000 }
    };

    if (!this.hasLoaded) {
      startLoading('preview');
    } else {
      finishLoading('preview');
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
    this.setDefaultSize();

    // Size and position images
    const { image: currentImage } = this.props.previewState;

    if (currentImage) {
      const { defaultState, useBackgroundImage } = this.props;
      
      // Save natural default image size if not passed in
      if (defaultState) {
        const { image: defaultImage, naturalWidth, naturalHeight } = defaultState.previewState;

        if (defaultImage && useBackgroundImage) {
          const isDefaultImage = currentImage === defaultImage;
          if (!isDefaultImage || !naturalWidth || !naturalHeight) {
            if (!isDefaultImage) {
              getNaturalImageSize(currentImage)
                .then(({ width: naturalWidth, height: naturalHeight }) => {
                  this.positionImage(naturalWidth, naturalHeight);
                });
            }

            getNaturalImageSize(defaultImage)
              .then(({ width: naturalWidth, height: naturalHeight }) => {
                if (isDefaultImage) this.positionImage(naturalWidth, naturalHeight);
                this.props.updateDefaultPreviewState({ naturalWidth, naturalHeight });
              });
          } else {
            this.positionImage(naturalWidth, naturalHeight);
            this.props.updateDefaultPreviewState({ naturalWidth, naturalHeight });
          }

          return;
        }
      }

      // Set initial size for user provided image for
      // generators that don't have an image by default
      getNaturalImageSize(currentImage)
        .then(({ width: naturalWidth, height: naturalHeight }) => {
          this.positionImage(naturalWidth, naturalHeight);
        });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps, prevState) {
    const { resetCount: prevResetCount } = prevProps;
    const { resetCount: currentResetCount } = this.props;
    const shouldResetWrapper = prevResetCount !== currentResetCount;
    const shouldResetPreview = !this.isResizing && !isEqual(prevProps, this.props) && this.isOutOfBounds();

    if (shouldResetWrapper || shouldResetPreview) {
      this.reset(shouldResetWrapper);
    }

    const { opacity: prevOpacity } = prevState.wrapperStyle;
    const { opacity: currentOpacity, width, height } = this.state.wrapperStyle;

    if (!currentOpacity && prevOpacity !== currentOpacity) {
      this.setWrapperStyle(width, height, 1);
    }
  }

  handleWindowResize = () => {
    const { hasResized, hasDragged } = this.props.previewState;

    if (!this.isResizing && ((!hasResized && !hasDragged) || this.isOutOfBounds())) {
      this.reset();
    } else if (!hasResized) {
      this.setDefaultSize();
    };
  }

  isOutOfBounds = () => {
    const canvas = document.querySelector('#canvas');

    if (this.preview && canvas) {
      const canvasRect = canvas.getBoundingClientRect();
      const previewRect = this.preview.getBoundingClientRect();
      const offset = 20;

      if (
        previewRect.right < canvasRect.left + offset || // Left
        previewRect.left > canvasRect.right - offset || // Right
        previewRect.bottom < canvasRect.top + offset || // Top
        previewRect.top > canvasRect.bottom - offset    // Bottom
      ) {
        return true;
      }
    }

    return false;
  }

  reset = shouldResetWrapper => {
    if (this.wrapper && shouldResetWrapper) {
      const { defaultState } = this.props;

      if (!defaultState || !defaultState.previewState.image) {
        this.wrapper.removeAttribute('style');
      }
    }
    
    const state = {
      hasDragged: false,
      hasResized: false,
      position: { x: 0, y: 0 },
      ...this.getDefaultSize(shouldResetWrapper)
    };

    this.props.updatePreview(state);

    this.size = null;
    this.isResizing = false;
    this.resizePosition = { x: 0, y: 0 };

    if (shouldResetWrapper) {
      const opacity = shouldResetWrapper ? 0 : 1;
      this.setWrapperStyle(state.width, state.height, opacity);
    }
  }

  getDefaultSize = shouldResetWrapper => {
    const { defaultState } = this.props;
    
    if (defaultState && shouldResetWrapper) {
      const { image, naturalWidth, naturalHeight } = defaultState.previewState;

      if (image && naturalWidth && naturalHeight) {
        return getImageSize(naturalWidth, naturalHeight);
      }
    }

    const width = this.wrapper ? this.wrapper.offsetWidth : defaultPreviewState.width;
    const height = this.wrapper ? this.wrapper.offsetHeight : defaultPreviewState.height;

    return { width, height };
  }

  setDefaultSize = () => {
    if (!this.props.previewState.hasResized && this.wrapper) {
      this.props.updatePreview({ ...this.getDefaultSize() });
    }
  }

  handleResizeStart = () => {
    const { width, height } = this.props.previewState;
    this.size = { width, height };
    this.isResizing = true;
  }

  handleResize = (event, direction, el, delta) => {
    // Lock aspect ratio when shift pressed
    this.lockAspectRatio = event.shiftKey;

    // If resizing from one of these directions, 
    // we should change the position of the element manually
    let x = 0, y = 0;
    const left = -delta.width;
    const top = -delta.height;
    const directions = ['top', 'left', 'topLeft', 'bottomLeft', 'topRight'];

    if (directions.includes(direction)) {
      if (direction === 'bottomLeft') {
        x = left;
      } else if (direction === 'topRight') {
        y = top;
      } else {
        x = left;
        y = top;
      }
    }

    this.resizePosition = { x, y };

    let { width, height } = this.size;

    width += delta.width;
    height += delta.height;

    this.props.updatePreview({ width, height });
  }

  handleResizeStop = (event, direction, el, delta) => {
    this.isResizing = false;

    if (this.isOutOfBounds()) {
      this.reset();
      return;
    }

    const { x: left, y: top } = this.resizePosition;
    const { x, y } = this.props.previewState.position;
    const position = {
      x: x + left,
      y: y + top
    }

    this.resizePosition = { x: 0, y: 0 };
    this.size = null;

    this.props.updatePreview({ position, hasResized: true });
  }

  handleDragStop = (event, data) => {
    if (this.isOutOfBounds()) {
      this.reset();
    } else {
      const { x, y } = data;
      this.props.updatePreview({ position: { x, y } });
    }
  }

  setWrapperStyle = (width, height, opacity = 1) => {
    const wrapperStyle = {
      width,
      height,
      marginLeft: -(width / 2),
      marginTop: -(height / 2),
      opacity
    };

    this.setState({ wrapperStyle });
  }

  positionImage = (naturalWidth, naturalHeight) => {
    let { width, height } = getImageSize(naturalWidth, naturalHeight);

    const { previewState, defaultState } = this.props;

    if (previewState && defaultState) {
      const { image: currentImage } = previewState;
      const { image: defaultImage } = defaultState.previewState;

      if (currentImage && defaultImage && currentImage === defaultImage) {
        this.props.updateDefaultPreviewState({ width, height, naturalWidth, naturalHeight });
      }
    }

    const { hasResized, width: currentWidth, height: currentHeight } = previewState;

    this.hasLoaded = true;
    this.setWrapperStyle(width, height);

    if (hasResized) {
      width = currentWidth;
      height = currentHeight;
    }

    finishLoading('preview');
    this.props.updatePreview({ width, height });
  }

  handleImageLoaded = (event) => {
    const { width: naturalWidth, height: naturalHeight } = event.target;
    this.positionImage(naturalWidth, naturalHeight);
  }

  handleImageError = () => {
    finishLoading('preview');
    addNotification(getNotificationTypes().error, 'Error adding image');
  }

  handleFileDrop = data => {
    this.hasLoaded = true;
    this.setWrapperStyle(data.width, data.height);
    
    const props = extend(data, {
      hasDragged: false,
      hasResized: false,
      position: { x: 0, y: 0 },
      resizePosition: { x: 0, y: 0 },
      background: 'transparent'
    });

    this.props.updatePreview(props);
  }

  renderPreview = (previewStyle) => {
    const { image } = previewStyle;

    if (image) {
      // Render img tag with preview styles
      const { 
        width,
        height,
        image, 
        ...restStyle 
      } = previewStyle;

      if (this.props.useBackgroundImage) {
        return (
          <div
            className="preview-style"
            style={{ width, height }}
          >
            <div 
              className="style"
              style={{ width, height, ...restStyle }}
            />
            <div
              className="image"
              style={{ width, height, backgroundImage: `url('${image}')` }}
            />
          </div>
        );
      } else {
        return (
          <img
            src={image}
            className="preview-style"
            style={previewStyle}
            onLoad={this.handleImageLoaded}
            onError={this.handleImageError}
            alt="Generator Preview"
          />
        );
      }
    }

    // Default to render div with preview styles
    return (
      <div
        className="preview-style"
        style={previewStyle}
      />
    );
  }

  render() {
    const { previewState, style, children } = this.props;
    const { position, width: _width, height: _height, ...restPreviewState } = previewState;
    const { isResizing, resizePosition } = this;
    const { x: left, y: top } = resizePosition;
    const previewStyle = extend({}, { ...restPreviewState }, style);
    const previewClassName = ['preview-window'];
    if (isResizing) previewClassName.push('resizing');

    let { width: minWidth, height: minHeight } = this.constraints.min;
    let { width: maxWidth, height: maxHeight } = this.constraints.max;
    let { width, height } = this.size ? this.size : previewState;

    if (previewStyle.boxSizing === 'content-box') {
      const borderAdjustment = parseInt(previewStyle.borderWidth, 10) * 2;
      width += borderAdjustment;
      height += borderAdjustment;
      minWidth += borderAdjustment;
      minHeight += borderAdjustment;
    }

    const wrapperStyle = extend({}, this.state.wrapperStyle);

    if (previewStyle.image) {
      if (this.hasLoaded) {
        previewStyle.opacity = 1;
        previewStyle.width = previewState.width;
        previewStyle.height = previewState.height;
      } else {
        previewStyle.opacity = 0;
        wrapperStyle.pointerEvents = 'none';
      }
    }

    return (
      <div>
        <FileDrop onFileDrop={this.handleFileDrop} />
        <div
          id="preview-wrapper"
          style={wrapperStyle}
          ref={wrapper => { this.wrapper = wrapper }}
        >
          <Draggable
            handle=".drag-handle"
            cancel=".resize-handle"
            position={position}
            onStop={this.handleDragStop}
          >
            <div
              className="resize-wrapper"
              style={{ left, top }}
              ref={preview => { this.preview = preview }}
            >
              <Resizable
                className={previewClassName.join(' ')}
                lockAspectRatio={this.lockAspectRatio}
                size={{ width, height }}
                minWidth={minWidth}
                maxWidth={maxWidth}
                minHeight={minHeight}
                maxHeight={maxHeight}
                onResizeStart={this.handleResizeStart}
                onResize={this.handleResize}
                onResizeStop={this.handleResizeStop}
              >
                {children}
                <div className="drag-handle" />
                <div className="resize-handle" />
                {this.renderPreview(previewStyle)}
              </Resizable>
            </div>
          </Draggable>
        </div>
      </div>
    );
  }
}

class Preview extends React.Component {
  render() {
    const {
      canvasColor,
      resetCount,
      children,
      className,
      useDefault,
      ...previewProps
    } = this.props;

    const canvasProps = { color: canvasColor };
    if (className) canvasProps.className = className;

    const defaultSpinnerColor = '#4834d4';
    if (canvasColor === 'transparent') {
      this.spinnerColor = defaultSpinnerColor;
    } else {
      if (canvasColor !== this.previewCanvasColor) {
        this.previousCanvasColor = canvasColor;
        this.spinnerColor = tinycolor.mostReadable(canvasColor, [defaultSpinnerColor, '#fff']);
      }
    }

    const preview = children && !useDefault ? children : (
      <PreviewWindow resetCount={resetCount} {...previewProps}>
        { children ? children : null }
      </PreviewWindow>
    );
    
    return (
      <Canvas {...canvasProps}>
        <div id="preview-loading">
          <LoadingSpinner color={this.spinnerColor} />
        </div>
        {preview}
      </Canvas>
    );
  }
}

const Canvas = ({ color: backgroundColor = 'transparent', className, children }) => {
  const canvasProps = {
    id: 'canvas',
    style: { backgroundColor }
  };

  const canvasClassName = [];
  if (className) canvasClassName.push(className);
  if (backgroundColor === 'transparent') canvasClassName.push('default');
  if (canvasClassName.length) canvasProps.className = canvasClassName.join(' ');

  return (
    <div {...canvasProps}>
      {children}
    </div>
  );
};

export default Preview;

export const defaultPreviewState = {
  width: 300,
  height: 300,
  background: '#fff',
  position: { x: 0, y: 0 },
  resizePosition: { x: 0, y: 0 },
  hasResized: false,
  hasDragged: false
};

export const defaultPreviewStateTypes = {
  width: Number,
  height: Number,
  background: String,
  position: { x: Number, y: Number },
  resizePosition: { x: Number, y: Number },
  hasResized: Boolean,
  hasDragged: Boolean
};