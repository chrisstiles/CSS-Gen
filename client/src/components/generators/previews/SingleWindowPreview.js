import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';
import _ from 'underscore';
import { addNotification, getNotificationTypes } from '../../../util/helpers';

class SingleWindowPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lockAspectRatio: false,
      resizing: false,
      droppingFile: false
    };

    this.generateResizeStyles = this.generateResizeStyles.bind(this);
    this.checkPreviewPosition = this.checkPreviewPosition.bind(this);
    this.handleDragStop = this.handleDragStop.bind(this);
    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.setImageDimensions = this.setImageDimensions.bind(this);
    this.handleImageError = this.handleImageError.bind(this);

    // Save initial width for centering
    this.initialWidth = props.size.width;
    this.generateResizeStyles();
  }

  componentDidMount() {
    this.checkPreviewPosition();
  }

  generateResizeStyles(width = this.initialWidth) {
    const { fullWidthPreview, centerPreivew } = this.props;
    const resizeStyles = {};

    if (!fullWidthPreview && (centerPreivew || centerPreivew === undefined)) {
      resizeStyles.left = '50%';
      resizeStyles.marginLeft = -(width / 2);
    } else {
      resizeStyles.left = 0;
    }

    this.resizeStyles = resizeStyles;
  }

  checkPreviewPosition() {
    const rect = this.previewContent.getBoundingClientRect();
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    const { x, y } = rect;
    const { width, height } = this.props.size;

    if (x > windowWidth - 340 || 
        x < -(width - 80) ||
        y > windowHeight ||
        y < (-height + 240)) {


      this.reset(width);
    } 
  }

  handleDragStop() {
    this.checkPreviewPosition();
  }

  handleResizeStart() {
    const top = parseInt(this.resizeWrapper.style.top, 10) || 0;
    const left = parseInt(this.resizeWrapper.style.left, 10) || 0;

    this.resizeWrapperPosition = {
      top: top,
      left: left
    };

    if (this.props.onResizeStart) {
      this.props.onResizeStart();
    }

    this.setState({ resizing: true });
  }

  handleResizeStop(event, direction, el, delta) {
    this.checkPreviewPosition();

    if (this.props.onResizeStop) {
      this.props.onResizeStop();
    }

    this.setState({ resizing: false });
  }

  handleResize(event, direction, el, delta) {
    // Lock aspect ratio when shift pressed
    this.setState({ lockAspectRatio: event.shiftKey });

    // If resizing from one of these directions, 
    // we should change the position of the element manually
    const directions = ['top', 'left', 'topLeft', 'bottomLeft', 'topRight'];
    const top = this.resizeWrapperPosition.top - delta.height;
    const left = this.resizeWrapperPosition.left - delta.width;

    if (directions.includes(direction)) {
      if (direction === 'bottomLeft') {
        this.resizeWrapper.style.left = `${left}px`;
      } else if (direction === 'topRight') {
        this.resizeWrapper.style.top = `${top}px`;
      } else {
        this.resizeWrapper.style.top = `${top}px`;
        this.resizeWrapper.style.left = `${left}px`;
      }
    }
  
    var { width, height } = this.resizable.state;

    if (this.props.generatorStyles.boxSizing === 'content-box') {
      const borderAdjustment = parseInt(this.props.generatorStyles.borderWidth, 10) * 2;
      width -= borderAdjustment;
      height -= borderAdjustment;
    }

    this.props.onResize({ width, height });
  }

  handleDragOver(event) {
    this.setState({ droppingFile: true });
    event.stopPropagation();
    event.preventDefault();
  }

  handleDragLeave(event) {
    this.setState({ droppingFile: false });
  }

  handleDrop(event) {
    this.imageLoaded = false;
    this.props.onFileDrop(event);
    event.nativeEvent.preventDefault();
    this.setState({ droppingFile: false });
  }

  reset(width = this.initialWidth) {
    this.generateResizeStyles(width);
    this.props.onDrag(null, { x: 0, y: 0 });
    this.resizeWrapper.style.top = 0;
    this.resizeWrapper.style.left = 0;
    this.draggable.setState({ x: 0, y: 0 });
  }

  setImageDimensions(e) {
    this.imageLoaded = true;
    const { width, height } = e.target;
    
    // Set image dimensions proportionally based on width of content area
    this.generateResizeStyles(width);
    this.props.onResize({ width, height });
  }

  handleImageError() {
    this.imageLoaded = true;
    addNotification(getNotificationTypes().error, 'Error adding image');
  }

  renderPreview(previewStyles) {
    if (previewStyles.image) {
      // Render img tag with preview styles
      return (
        <img 
          src={previewStyles.image}
          className="preview-style"
          style={previewStyles}
          onLoad={this.setImageDimensions}
          onError={this.handleImageError}
          alt="Generator Preview"
        />
      );
    } else {
      // Default to render div with preview styles
      return (
        <div 
          className="preview-style"
          style={previewStyles}
        />
      )
    }
  }

  render() {
    const { generatorStyles, defaultPosition } = this.props;
    const previewStyles = _.extend({}, generatorStyles);

    var className = 'generator-preview';
    var { width, height } = this.props.size;

    var borderAdjustment = 0;
    if (generatorStyles.boxSizing === 'content-box') {
      // className += ' cb';
      // previewStyles.boxSizing = 'content-box';

      // Add border size to preview
      borderAdjustment = parseInt(generatorStyles.borderWidth, 10) * 2;
      width += borderAdjustment;
      height += borderAdjustment;
    }

    if (this.state.resizing) {
      className += ' resizing';
    }

    // Add file drop if callback is passed
    var fileDropProps = {};

    if (this.props.onFileDrop) {
      fileDropProps.onDragOver = this.handleDragOver;
      fileDropProps.onDragLeave = this.handleDragLeave;
      fileDropProps.onDrop = this.handleDrop;

      if (this.state.droppingFile) {
        className += ' dropping';
      }
    }

    if (this.imageLoaded || !previewStyles.image) {
      previewStyles.width = width - borderAdjustment;
      previewStyles.height = height - borderAdjustment;
    } else {
      // If image is still loading hide until we know the dimensions
      // previewStyles.visibility = 'hidden';
      previewStyles.maxWidth = '100%';
      previewStyles.height = 'auto';
    }

    return (
      <Draggable 
        handle=".drag-handle"
        ref={draggable => { this.draggable = draggable; }}
        onDrag={this.props.onDrag}
        onStop={this.handleDragStop}
        defaultPosition={defaultPosition}
      >
        <div 
          className="resize-wrapper" 
          ref={el => { this.resizeWrapper = el; }}
          {...fileDropProps}
        > 
          <Resizable
            id={this.props.id}
            ref={resizable => { this.resizable = resizable; }}
            className={className}
            style={this.resizeStyles}
            size={{ width, height }}
            minWidth={this.props.constraints.width.min}
            maxWidth={this.props.constraints.width.max}
            minHeight={this.props.constraints.height.min}
            maxHeight={this.props.constraints.height.max}
            onResizeStart={this.handleResizeStart}
            onResizeStop={this.handleResizeStop}
            onResize={this.handleResize}
            lockAspectRatio={this.state.lockAspectRatio}
          >
            <div 
              className="preview-content"
              ref={previewContent => { this.previewContent = previewContent; }}
            >
              {this.props.children}
            </div>
            <div className="drag-handle" />
            <div className="resize-handle" />
            {this.renderPreview(previewStyles)}
          </Resizable>
        </div>
      </Draggable>
    );
  }
}

export default SingleWindowPreview;
