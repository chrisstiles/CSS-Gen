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
      droppingFile: false,
      axis: 'both',
      axisSelected: false
    };

    // The axis for dragging the preview window
    // this.axis = 'both';

    this.generateResizeStyles = this.generateResizeStyles.bind(this);
    this.checkPreviewPosition = this.checkPreviewPosition.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
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

  handleDragStart() {
    // this.setState({ axis: 'both', axisSelected: false });
  }

  handleDrag(event, data) {
    // Restrict dragging to x or y axis if shift key is held
    const { deltaX, deltaY } = data;
    var axis, dragX, dragY;

    if (event.shiftKey) {
      if (!this.state.axisSelected) {
        const _deltaX = Math.abs(deltaX);
        const _deltaY = Math.abs(deltaY);

        if (_deltaX !== _deltaY) {
          // Choose either x or y axis
          if (_deltaX > _deltaY) {
            axis = 'x';
          } else if (_deltaY > _deltaX) {
            axis = 'y';
          }

          this.setState({ axisSelected: true, axis });
        } 

      }
    } else {
      if (this.state.axisSelected) {
        this.setState({ axisSelected: false, axis: 'both' });
      }
    }

    // if (axis === 'x') {
    //   dragX = x;
    //   dragY = lastY;
    // } else if (axis === 'y') {
    //   dragX = lastX;
    //   dragY = y;
    // } else {
    //   dragX = x;
    //   dragY = y;
    // }

    // this.props.onUpdate({ dragX, dragY });
  }

  handleDragStop(event, data) {
    const { x: newX, y: newY } = data;
    const { x: lastX, y: lastY } = this.props.position;
    var dragX, dragY;

    if (this.state.axis === 'x') {
      dragX = newX;
      dragY = lastY;
    } else if (this.state.axis === 'y') {
      dragX = lastX;
      dragY = newY;
    } else {
      dragX = newX;
      dragY = newY;
    }

    this.setState({ axisSelected: false, axis: 'both' });
    this.draggable.setState({ x: dragX, y: dragY });
    this.checkPreviewPosition();
    this.props.onUpdate({ dragX, dragY });

    console.log(dragX, dragY);
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
        // x = left;
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
    } else {
      this.props.onUpdate({ previewContentLoaded: true });
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
    const { styles, position, previewContentLoaded } = this.props;
    const previewStyles = _.extend({}, styles);

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

    if (previewContentLoaded || !previewStyles.image) {
      previewStyles.width = width - borderAdjustment;
      previewStyles.height = height - borderAdjustment;
    } else {
      // If image is still loading hide until we know the dimensions
      previewStyles.opacity = 0;
    }

    const { x: left, y: top } = this.props.resizePosition;
    const previewContentClass = previewContentLoaded ? 'preview-content' : 'preview-content hidden';

    return (
      <Draggable 
        handle=".drag-handle"
        axis={this.state.axis}
        ref={draggable => { this.draggable = draggable; }}
        onDrag={this.handleDrag}
        onStop={this.handleDragStop}
        defaultPosition={position}
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
            <div>
              <div 
                className={previewContentClass}
                ref={previewContent => { this.previewContent = previewContent; }}
              >
                {this.props.children}
              </div>
              <div className="drag-handle" />
              <div className="resize-handle" />
            </div>
            {this.renderPreview(previewStyles)}
          </Resizable>
        </div>
      </Draggable>
    );
  }
}

export default SingleWindowPreview;
