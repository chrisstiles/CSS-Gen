import React from 'react';
import Draggable from 'react-draggable';
import Resizable from 're-resizable';
import _ from 'underscore';

class PreviewWindow extends React.Component {
  constructor(props) {
    super(props);

    this.constraints = {
      width: { min: 60, max: 3000 },
      height: { min: 60, max: 3000 }
    }

    this.handleResizeStart = this.handleResizeStart.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  handleResizeStart() {
    const top = parseInt(this.resizeWrapper.style.top, 10) || 0;
    const left = parseInt(this.resizeWrapper.style.left, 10) || 0;

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

    this.props.handlePreviewWindowResize();
  }

  handleTick(up = true, type = 'width') {
    const step = 1;
    var newValue = up ? this.resizable.state[type] + step : this.resizable.state[type] - step;

    const min = this.constraints[type].min;
    const max = this.constraints[type].max;

    if (newValue >= min && newValue <= max) {
      // console.log(this.resizable.state[type])

      var newState = {};
      newState[type] = newValue;

      this.resizable.setState(newState);
      this.props.handlePreviewWindowResize(newValue, type);

      // this.props.handleChange(this.props.name, newValue);
      // this.textInput.value = newValue;
    }
  }

  generateStyles() {
    const css = {
      backgroundColor: this.props.backgroundColor
    };

    return _.extend({}, css, this.props.style);
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
            style={this.generateStyles()}
            id="box-shadow-preview"
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