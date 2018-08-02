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
    
    var deg = radToDeg(Math.atan2(x, y));
    deg -= 90;

    if (deg < 0) {
      deg += 360;
    }
    
    return deg;
  }

  normalize(degree) {
    const max = this.props.max === undefined ? 360 : this.props.max;
    const min = this.props.min === undefined ? 0 : this.props.min;
    const step = this.props.step || 1;
    const n = Math.max(min, Math.min(degree, max));
    const s = n - (n % step);
    const high = Math.ceil(n / step);
    const low = Math.round(n / step);
    return high >= (n / step)
      ? (high * step === 360) ? 0 : (high * step)
      : low * step;
  }

  handleTrackingChange(event) {
    const vector = {
      x: event.x,
      y: event.y
    };

    const deg = this.getAngle(vector);
    const value = this.normalize(deg);

    console.log(deg, value)
    this.props.onChange(value, this.props.name);
  }

  handleMouseDown(event) {
    this.beginTracking();
  }

  handleMouseMove(event) {
    // console.log('hello')
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
      transform: `rotate(-${this.props.angle}deg)`
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