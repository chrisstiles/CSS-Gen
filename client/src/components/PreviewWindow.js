import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';

class PreviewWindow extends React.Component {
  constructor(props) {
    super(props);

    this.constraints = {
      width: { min: 160, max: 3000 },
      height: { min: 80, max: 3000 }
    };

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

    var top = this.resizeWrapperPosition.top;
    var left = this.resizeWrapperPosition.left;

    const altWidth = event.altKey ? (delta.width / 2) : 0;
    const altHeight = event.altKey ? (delta.height / 2) : 0;

    // if (event.altKey) {
    //   left += ;
    //   top += (delta.height / 2);
    // }

    if (directions.includes(direction)) {
      // left = left - (delta.width + altWidth);
      // top = top - (delta.height + altHeight);

      left -= delta.width;
      top -= delta.height;

      if (event.altKey) {
        left += altWidth;
        top += altHeight;
      }
    } else {
      if (event.altKey) {
        left -= altWidth;
        top -= altHeight;
      }
    }

    if (event.altKey) {
      const newSize = {
        width: this.props.size.width + altWidth,
        height: this.props.size.height + altHeight,
      };

      console.log(newSize)

      this.resizable.setState(newSize);
    }

    

    // console.log(direction)

    switch (direction) {
      case 'top':
        this.resizeWrapper.style.top = `${top}px`;
        this.resizeWrapper.style.left = `${left}px`;
        break;
      
      case 'right':
        this.resizeWrapper.style.left = `${left}px`;
        break;

      case 'left':
        this.resizeWrapper.style.top = `${top}px`;
        this.resizeWrapper.style.left = `${left}px`;
        break;

      case 'topRight':
        this.resizeWrapper.style.top = `${top}px`;
        break;

      case 'bottomRight':

        break;

      case 'bottomLeft':
        this.resizeWrapper.style.left = `${left}px`;
        break;

      case 'topLeft':
        this.resizeWrapper.style.top = `${top}px`;
        this.resizeWrapper.style.left = `${left}px`;
        break;
    }
    
    // if (directions.includes(direction)) {
    //   if (direction === 'bottomLeft') {
    //     this.resizeWrapper.style.left = `${left}px`;
    //   } else if (direction === 'topRight') {
    //     this.resizeWrapper.style.top = `${top}px`;
    //   } else {
    //     this.resizeWrapper.style.top = `${top}px`;
    //     this.resizeWrapper.style.left = `${left}px`;
    //   }
    // }

    this.props.handlePreviewWindowResize();
  }

  handleTick(up = true, type = 'width', shiftHeld) {
    const step = shiftHeld ? 10 : 1;
    var newValue = up ? Number(this.resizable.state[type]) + step : Number(this.resizable.state[type]) - step;

    const min = this.constraints[type].min;
    const max = this.constraints[type].max;

    var newState = {};
    var value;

    if (newValue >= min && newValue <= max) {
      newState[type] = newValue;
      value = newValue;
    } else if (newValue < min) {
      newState[type] = min;
      value = min;
    } else {
      newState[type] = max;
      value = max;
    }

    this.resizable.setState(newState);
    this.props.handlePreviewWindowResize(value, type);
  }

  reset() {
    this.resizeWrapper.style.top = 0;
    this.resizeWrapper.style.left = 0;
    this.draggable.setState({ x: 0, y: 0 });
    this.resizable.setState({ width: this.props.size.width, height: this.props.size.height });
  }

  render() {
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
            className="generator-preview"
            defaultSize={{
              width: this.props.size.width,
              height: this.props.size.height,
            }}
            minWidth={this.constraints.width.min}
            maxWidth={this.constraints.width.max}
            minHeight={this.constraints.height.min}
            maxHeight={this.constraints.height.max}
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

export default PreviewWindow;