import React from 'react';
import NumberInput from './NumberInput';
import { radToDeg } from '../../util/helpers';

class AnglePicker extends React.Component {
  constructor(props) {
    super(props);

    this.handleTrackingChange = this.handleTrackingChange.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.beginTracking = this.beginTracking.bind(this);
    this.endTracking = this.endTracking.bind(this); 
  }

  componentDidMount() {
    window.addEventListener('blur', this.endTracking, false);
    window.addEventListener('focus', this.endTracking, false);
    document.addEventListener('visibilitychange', this.endTracking, false);
  }

  componentWillUnmount() {
    window.removeEventListener('blur', this.endTracking, false);
    window.removeEventListener('focus', this.endTracking, false);
    document.removeEventListener('visibilitychange', this.endTracking, false);
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
    if (this.tracking) {
      this.handleTrackingChange(event);
    }
  }

  handleMouseUp(event) {
    this.handleTrackingChange(event);
    this.endTracking();
  }

  beginTracking() {
    this.tracking = true;
    document.body.classList.add('no-select');
    document.body.addEventListener('mousemove', this.handleMouseMove, false);
    document.body.addEventListener('mouseup', this.handleMouseUp, false);
  }

  endTracking() {
    this.tracking = false;
    document.body.classList.remove('no-select');
    document.body.removeEventListener('mousemove', this.handleMouseMove, false);
    document.body.removeEventListener('mouseup', this.handleMouseUp, false);
  }

  handleTextChange(value) {
    var deg = value % 360;

    if (deg < 0) {
      deg += 360;
    }

    this.props.onChange(deg, this.props.name);
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
          onBlur={this.endTracking}
        >
          <div 
            className="angle" 
            style={style}
          />
        </div>
        <NumberInput
          className="angle-input"
          value={this.props.angle}
          onChange={this.handleTextChange}
          min={-9999}
          max={9999}
          forceUpdate={this.tracking}
          appendString="°"
        />
      </div>
    );
  }
}

export default AnglePicker;