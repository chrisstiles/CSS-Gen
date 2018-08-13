import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';
import _ from 'underscore';
import { addNotification, getNotificationTypes, getImageSize } from '../../../util/helpers';

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
    this.setImageDimensions = this.setImageDimensions.bind(this);
    this.handleImageError = this.handleImageError.bind(this);

    // Save initial width for centering
    if (this.props.styles.image && this.props.hasResized) {
      this.initialWidth = props.size.width;
    } else {
      this.initialWidth = props.defaultWidth;
    }

    this.generateResizeStyles(this.initialWidth, props.resizeMarginAdjustment);
  }

  componentDidMount() {
    this.checkPreviewPosition();
  }

  generateResizeStyles(width = this.initialWidth, marginLeft) {
    const { fullWidthPreview, centerPreview } = this.props;
    const { image } = this.props.styles;
    const resizeStyles = {};

    if ((!fullWidthPreview || image) && (centerPreview || centerPreview === undefined)) {
      resizeStyles.left = '50%';

      if (!marginLeft) {
        marginLeft = -(width / 2);
      }

      resizeStyles.marginLeft = marginLeft;
    } else {
      resizeStyles.left = 0;
    }

    this.resizeStyles = resizeStyles;
  }

  checkPreviewPosition() {
    if (this.previewContent) {
      const rect = this.previewContent.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;
      const presetBar = document.querySelector('#preset-bar');

      // Prevent getting stuck behind preset bar
      if (presetBar) {
        windowHeight -= presetBar.offsetHeight;
      }
      
      const { x, y } = rect;
      const { width, height } = this.props.size;

      if (x > windowWidth - 340 || 
          x < -(width - 80) ||
          y > windowHeight ||
          y < (-height + 240)) {

        this.reset(width);
      } 
    }
  }

  handleDragStop(event, data) {
    this.checkPreviewPosition();
    const { x: dragX, y: dragY } = data;
    this.props.onUpdate({ dragX, dragY });
  }

  handleResizeStart() {
    this.resizeWrapperPosition = _.extend(this.props.resizePosition);

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
    this.lockAspectRatio = event.shiftKey;

    // If resizing from one of these directions, 
    // we should change the position of the element manually
    const directions = ['top', 'left', 'topLeft', 'bottomLeft', 'topRight'];
    var { x, y } = this.resizeWrapperPosition;

    const left = x - delta.width;
    const top = y - delta.height;
    
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

    const resizePosition = { x, y };
  
    var { width, height } = this.resizable.state;

    if (this.props.styles.boxSizing === 'content-box') {
      const borderAdjustment = parseInt(this.props.styles.borderWidth, 10) * 2;
      width -= borderAdjustment;
      height -= borderAdjustment;
    }

    const resizeMarginAdjustment = this.resizeStyles.marginLeft;

    this.props.onUpdate({ hasResized: true, width, height, resizePosition, resizeMarginAdjustment });
  }

  reset(width = this.initialWidth) {
    this.generateResizeStyles(width);
    this.props.onUpdate({ dragX: 0, dragY: 0, resizePosition: { x: 0, y: 0 } });
    this.draggable.setState({ x: 0, y: 0 });
  }

  setImageDimensions(e) {
    const { width: naturalWidth, height: naturalHeight } = e.target;
    const { width, height } = getImageSize(naturalWidth, naturalHeight);

    // Set image dimensions proportionally based on width of content area
    if (!this.props.hasResized) {
      this.props.onUpdate({ previewContentLoaded: true, width, height });
      this.generateResizeStyles(width);  
    }
    
    e.target.style.opacity = 1;
  }

  handleImageError() {
    addNotification(getNotificationTypes().error, 'Error adding image');
  }

  renderPreview(previewStyles) {
    const { image } = previewStyles;

    if (image) {
      // Render img tag with preview styles
      const { width, height } = previewStyles;

      if (this.props.userImageAsBackground) {
        // previewStyles.backgroundImage = `url('${image}')`;
        return (
          <div 
            className="preview-style"
            style={{ width, height }}
          >
            <div
              className="style"
              style={previewStyles}
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
            style={previewStyles}
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
        style={previewStyles}
      />
    );
  }

  render() {
    const { styles, defaultPosition, previewContentLoaded } = this.props;
    const previewStyles = _.extend({}, styles);

    // console.log(this.props)

    var className = 'generator-preview';
    var { width, height } = this.props.size;

    var borderAdjustment = 0;
    if (styles.boxSizing === 'content-box') {
      // Add border size to preview
      borderAdjustment = parseInt(styles.borderWidth, 10) * 2;
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

    if (previewContentLoaded || !previewStyles.image) {
      previewStyles.width = width - borderAdjustment;
      previewStyles.height = height - borderAdjustment;
    } else {
      // If image is still loading hide until we know the dimensions
      previewStyles.opacity = 0;
    }

    const { x: left, y: top } = this.props.resizePosition;

    return (
      <Draggable 
        handle=".drag-handle"
        ref={draggable => { this.draggable = draggable; }}
        onStop={this.handleDragStop}
        defaultPosition={defaultPosition}
      >
        <div 
          className="resize-wrapper" 
          style={{ left, top }}
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
            lockAspectRatio={this.lockAspectRatio}
          >
            {previewContentLoaded ? 
              <div>
                <div 
                  className="preview-content"
                  ref={previewContent => { this.previewContent = previewContent; }}
                >
                  {this.props.children}
                </div>
                <div className="drag-handle" />
                <div className="resize-handle" />
              </div>
            : null}
            {this.renderPreview(previewStyles)}
          </Resizable>
        </div>
      </Draggable>
    );
  }
}

export default SingleWindowPreview;
