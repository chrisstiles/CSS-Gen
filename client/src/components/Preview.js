import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';
import { extend, isEqual } from 'underscore';

class PreviewWindow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isResizing: false,
      resizePosition: extend({}, props.previewState.resizePosition)
    };

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

  updatePreviewState = state => {
    const previewState = extend({}, this.props.previewState, state);
    this.props.updateGenerator({ previewState });
  }

  reset = () => {
    const state = {
      hasDragged: false,
      hasResized: false,
      position: { x: 0, y: 0 },
      ...this.getDefaultSize()
    };

    this.updatePreviewState(state);
    this.setState({ isResizing: false, resizePosition: { x: 0, y: 0 } });
  }

  getDefaultSize = () => {
    const width = this.wrapper ? this.wrapper.offsetWidth : defaultPreviewState.width;
    const height = this.wrapper ? this.wrapper.offsetHeight : defaultPreviewState.height;

    return { width, height };
  }

  setDefaultSize = () => {
    if (!this.props.previewState.hasResized && this.wrapper) {
      this.updatePreviewState({ ...this.getDefaultSize() });
    }
  }

  handleResizeStart = () => {
    this.setState({ isResizing: true });
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

    this.setState({ resizePosition: { x, y } });
  }

  handleResizeStop = (event, direction, el, delta) => {
    if (this.isOutOfBounds()) {
      this.reset();
      return;
    }

    let { width, height } = this.props.previewState;
    
    width += delta.width;
    height += delta.height;

    const { x: left, y: top } = this.state.resizePosition;
    const { x, y } = this.props.previewState.position;
    const position = {
      x: x + left,
      y: y + top
    }

    this.setState({ isResizing: false, resizePosition: { x: 0, y: 0 } });
    this.updatePreviewState({ width, height, position, hasResized: true });
  }

  handleDragStop = (event, data) => {
    if (this.isOutOfBounds()) {
      this.reset();
    } else {
      const { x, y } = data;
      this.updatePreviewState({ position: { x, y } });
    }
  }

  render() {
    const { previewState, style } = this.props;
    const { width, height, position, ...restPreviewState } = previewState;
    const { isResizing, resizePosition } = this.state;
    const { x: left, y: top } = resizePosition;
    const previewStyle = extend({}, { ...restPreviewState }, style);
    const previewClassName = ['preview-window'];
    if (isResizing) previewClassName.push('resizing');


    let { width: minWidth, height: minHeight } = this.constraints.min;
    let { width: maxWidth, height: maxHeight } = this.constraints.max;

    return (
      <div 
        id="preview-wrapper" 
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
              style={previewStyle}
              onResizeStart={this.handleResizeStart}
              onResize={this.handleResize}
              onResizeStop={this.handleResizeStop}
            >
              <div className="drag-handle" />
              <div className="resize-handle" />
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