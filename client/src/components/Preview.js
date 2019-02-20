import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';
import { extend, isEqual } from 'underscore';
import { getImageSize } from '../util/helpers';

class PreviewWindow extends React.Component {
  constructor(props) {
    super(props);

    this.loaded = !props.previewState.image;

    this.isResizing = false;
    this.resizePosition = extend({}, props.previewState.resizePosition);

    this.constraints = {
      min: { width: 80, height: 80 },
      max: { width: 3000, height: 3000 }
    };

  }

  componentDidMount() {
    this.setDefaultSize();
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps, this.props) && this.isOutOfBounds()) {
      this.reset();
    }
  }

  handleWindowResize = () => {
    const { hasResized, hasDragged } = this.props.previewState;

    if ((!hasResized && !hasDragged) || this.isOutOfBounds()) {
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

  reset = () => {
    const state = {
      hasDragged: false,
      hasResized: false,
      position: { x: 0, y: 0 },
      ...this.getDefaultSize()
    };

    this.props.updatePreview(state);

    this.size = null;
    this.isResizing = false;
    this.resizePosition = { x: 0, y: 0 };
  }

  getDefaultSize = () => {
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

    this.isResizing = false;
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

  setImageDimensions = (event) => {
    const { width: naturalWidth, height: naturalHeight } = event.target;
    const { width, height } = getImageSize(naturalWidth, naturalHeight);
    const { hasResized } = this.props.previewState;
    console.log(width, height)

    // Set image dimensions proportionally based on width of content area
    // if (!hasResized) {
    //   // this.props.onUpdate({ previewContentLoaded: true, width, height });
    //   // this.generateResizeStyles(width);
    //   this.updatePreview({ width, height });
    // } else {
    //   this.props.onUpdate({ previewContentLoaded: true });
    // }
    this.loaded = true;
    this.props.updatePreview({ width, height });

    // finishLoading('preview-content');

    // event.target.style.opacity = 1;
  }

  handleImageError = () => {
    // addNotification(getNotificationTypes().error, 'Error adding image');
  }

  renderPreview = (previewStyle) => {
    const { image } = previewStyle;

    if (image) {
      // Render img tag with preview styles
      const { width, height } = previewStyle;

      if (this.props.userImageAsBackground) {
        return (
          <div
            className="preview-style"
            style={{ width, height }}
          >
            <div
              className="style"
              style={previewStyle}
            />
            <div
              className="background"
              style={{ backgroundImage: `url('${image}')` }}
            />
          </div>
        );
      } else {
        return (
          <img
            src={image}
            className="preview-style"
            style={previewStyle}
            onLoad={this.setImageDimensions}
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
    const { previewState, style } = this.props;
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

    // const wrapperStyle = { 
    //   width, 
    //   height,
    //   marginLeft: -(width / 2),
    //   marginTop: -(height / 2)
    // };

    if (previewStyle.image && this.loaded) {
      previewStyle.width = previewState.width;
      previewStyle.height = previewState.height;
    }

    return (
      <div 
        id="preview-wrapper" 
        // style={wrapperStyle}
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
              <div className="drag-handle" />
              <div className="resize-handle" />
              {this.renderPreview(previewStyle)}
            </Resizable>
          </div>
        </Draggable>
      </div>
    );
  }
}

class Preview extends React.Component {
  shouldComponentUpdate(prevProps) {
    return (!isEqual(prevProps), this.props);
  }

  render() {
    const { 
      canvasColor, 
      children,
      ...previewProps 
    } = this.props;

    const preview = children ? children : (
      <PreviewWindow {...previewProps} />
    );

    return (
      <div id="generator-preview">
        <Canvas color={canvasColor}>
          {preview}
        </Canvas>
      </div>
    );
  }
}

const Canvas = ({ color: backgroundColor = 'transparent', children }) => {
  const canvasProps = {
    id: 'canvas',
    style: { backgroundColor }
  };

  if (backgroundColor === 'transparent') canvasProps.className = 'default';

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