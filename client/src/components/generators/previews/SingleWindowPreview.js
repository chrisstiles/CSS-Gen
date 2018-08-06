import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';

class SingleWindowPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lockAspectRatio: false,
      resizing: false,
      droppingFile: false
    };

    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleDragLeave = this.handleDragLeave.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
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

    if (this.props.style.boxSizing === 'content-box' && this.props.style.borderWidth) {
      const borderAdjustment = parseInt(this.props.style.borderWidth, 10) * 2;

      width -= borderAdjustment;
      height -= borderAdjustment;

      this.resizable.setState({ 
        width: width, 
        height: height
      });
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
    // console.log(event.nativeEvent.dataTransfer.files)
    this.props.onFileDrop(event);
    // event.nativeEvent.stopPropagation();
    event.nativeEvent.preventDefault();
    // console.log(event.nativeEvent.dataTransfer.files)
    this.setState({ droppingFile: false });
  }

  reset() {
    this.resizeWrapper.style.top = 0;
    this.resizeWrapper.style.left = 0;
    this.draggable.setState({ x: 0, y: 0 });
    this.resizable.setState({ width: this.props.size.width, height: this.props.size.height });
  }

  render() {
    var className = 'generator-preview';

    if (this.props.style.boxSizing === 'content-box') {
      className += ' cb';
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

    return (
      <Draggable 
        handle=".drag-handle"
        ref={draggable => { this.draggable = draggable; }}
      >
        <div 
          className="resize-wrapper" 
          ref={el => { this.resizeWrapper = el; }}
          {...fileDropProps}
        >
          <Resizable
            style={this.props.style}
            id={this.props.id}
            ref={resizable => { this.resizable = resizable; }}
            className={className}
            size={{
              width: this.props.size.width,
              height: this.props.size.height
            }}
            minWidth={this.props.constraints.width.min}
            maxWidth={this.props.constraints.width.max}
            minHeight={this.props.constraints.height.min}
            maxHeight={this.props.constraints.height.max}
            onResizeStart={this.handleResizeStart}
            onResizeStop={this.handleResizeStop}
            onResize={this.handleResize}
            lockAspectRatio={this.state.lockAspectRatio}
          >
            {this.props.children}
            <div className="drag-handle" />
            <div className="resize-handle" />
          </Resizable>
        </div>
      </Draggable>
    );
  }
}

export default SingleWindowPreview;
