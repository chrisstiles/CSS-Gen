import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';

class SingleWindowPreview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lockAspectRatio: false
    };

    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResizeStop = this.handleResizeStop.bind(this);
    this.handleResize = this.handleResize.bind(this);
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
  }

  handleResizeStop(event, direction, el, delta) {
    if (this.props.onResizeStop) {
      this.props.onResizeStop();
    }
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

    // var widthAdjustment, heightAdjustment;
    if (this.props.style.boxSizing === 'content-box') {
      // className += ' cb';
      // width -= 20;
      // height -= 20;
      console.log('hello')

      this.resizable.setState({ 
        width: width - 20, 
        height: height - 20 });
    } else {
      // widthAdjustment = 0;
      // heightAdjustment = 0;
    }

    this.props.onResize({ width, height });
  }

  reset() {
    this.resizeWrapper.style.top = 0;
    this.resizeWrapper.style.left = 0;
    this.draggable.setState({ x: 0, y: 0 });
    this.resizable.setState({ width: this.props.size.width, height: this.props.size.height });
  }

  render() {
    console.log('testing')
    var className = 'generator-preview';

    var widthAdjustment, heightAdjustment;
    if (this.props.style.boxSizing === 'content-box') {
      className += ' cb';
      widthAdjustment = 20;
      heightAdjustment = 20;
    } else {
      widthAdjustment = 0;
      heightAdjustment = 0;
    }

    return (
      <Draggable 
        handle=".drag-handle"
        ref={draggable => { this.draggable = draggable; }}
      >
        <div className="resize-wrapper" ref={el => { this.resizeWrapper = el; }}>
          <Resizable
            style={this.props.style}
            id={this.props.id}
            ref={resizable => { this.resizable = resizable; }}
            className={className}
            size={{
              width: this.props.size.width + widthAdjustment,
              height: this.props.size.height + heightAdjustment
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
          </Resizable>
        </div>
      </Draggable>
    );
  }
}

export default SingleWindowPreview;