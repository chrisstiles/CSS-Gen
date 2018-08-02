import React from 'react';
import { radToDeg } from '../../util/helpers';

class AnglePicker extends React.Component {
  constructor(props) {
    super(props);

    this.handleTrackingChange = this.handleTrackingChange.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.normalize = this.normalize.bind(this);
  }

  getCenter() {
    const rect = this.element.getBoundingClientRect();

    return {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2)
    };
  }

  getAngle(vector) {
    const center = this.getCenter();
    const x = vector.x - center.x;
    const y = vector.y - center.y;
    const deg = radToDeg(Math.atan2(x, y));
    
    return Math.round(Math.abs(deg - 180));
  }

  handleTrackingChange(event) {
    const vector = {
      x: event.clientX,
      y: event.clientY
    };

    const deg = this.getAngle(vector);

    this.props.onChange(deg, this.props.name);
  }

  handleMouseDown(event) {
    this.handleTrackingChange(event);
    this.beginTracking();
  }

  handleMouseMove(event) {
    this.handleTrackingChange(event);
  }

  handleMouseUp(event) {
    this.handleTrackingChange(event);
    this.endTracking();
  }

  beginTracking() {
    document.body.addEventListener('mousemove', this.handleMouseMove, false);
    document.body.addEventListener('mouseup', this.handleMouseUp, false);
    this.tracking = true;
  }

  endTracking() {
    document.body.removeEventListener('mousemove', this.handleMouseMove, false);
    document.body.removeEventListener('mouseup', this.handleMouseUp, false);
    this.tracking = false;
  }

  render() {
    const style = {
      transform: `rotate(${this.props.angle}deg)`
    };

    return (
      <div className="field-wrapper angle-picker-wrapper">
        <label className="title">{this.props.label}</label>
        <div 
          className="angle-picker"
          ref={element => {this.element = element}}
          onMouseDown={this.handleMouseDown}
        >
          <div 
            className="angle" 
            style={style}
          />
        </div>
      </div>
    );
  }
}

export default AnglePicker;