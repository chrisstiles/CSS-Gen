import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';

class PreviewWindow extends React.Component {
  constructor(props) {
    super(props);

    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  handleResizeStart() {
    const top = parseInt(this.resizeWrapper.style.top) || 0;
    const left = parseInt(this.resizeWrapper.style.left) || 0;

    this.resizeWrapperPosition = {
      top: top,
      left: left
    };
  }

  handleResize(event, direction, el, delta) {
    // If resizing from one of these directions, 
    // we should change the position of the element manually
    const directions = ['top', 'left', 'topLeft', 'bottomLeft', 'topRight'];
    
    if (directions.includes(direction)) {
      const top = this.resizeWrapperPosition.top - delta.height;
      const left = this.resizeWrapperPosition.left - delta.width;

      if (direction === 'bottomLeft') {
        this.resizeWrapper.style.left = `${left}px`;
      } else if (direction === 'topRight') {
        this.resizeWrapper.style.top = `${top}px`;
      } else {
        this.resizeWrapper.style.top = `${top}px`;
        this.resizeWrapper.style.left = `${left}px`;
      }
    }
  }

  resetWindow() {
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
            id="box-shadow-preview"
            ref={resizable => { this.resizable = resizable; }}
            className="generator-preview"
            defaultSize={{
              width: this.props.size.width,
              height: this.props.size.height,
            }}
            onResizeStart={this.handleResizeStart}
            onResize={this.handleResize}
          >
            <div className="drag-handle" />
          </Resizable>
        </div>
      </Draggable>
    );
  }
}

export default PreviewWindow;