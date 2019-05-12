import React from 'react';
import NumberInput from './NumberInput';
import Toggle from './Toggle';
import { radToDeg, disabledTouchmove } from '../../util/helpers';

class AnglePicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.checkActive(props);
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

  checkActive = (props = this.props) => {
    const { isActive = true } = props;
    this.isActive = isActive;
  }

  handleActiveToggle = (active) => {
    if (this.props.onActiveToggle) {
      this.props.onActiveToggle(active, this.props.name);
    }
  }

  getCenter = () => {
    const rect = this.element.getBoundingClientRect();

    return {
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2)
    };
  }

  getAngle = (vector) => {
    const center = this.getCenter();
    const x = vector.x - center.x;
    const y = vector.y - center.y;
    const deg = radToDeg(Math.atan2(x, y));
    
    return Math.round(Math.abs(deg - 180));
  }

  handleTrackingChange = (event) => {
    let clientX, clientY;
    
    if (event.type === 'touchmove') {
      const target = event.targetTouches[0];
      clientX = target.clientX;
      clientY = target.clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    if (clientX === undefined || clientY === undefined) return;

    const vector = {
      x: clientX,
      y: clientY
    };

    const deg = this.getAngle(vector);

    this.props.onChange(deg, this.props.name);
  }

  handleMouseDown = (event) => {
    this.handleTrackingChange(event);
    this.beginTracking();
  }

  handleMouseMove = (event) => {
    if (this.tracking) {
      event.preventDefault();
      this.handleTrackingChange(event);
    }
  }

  handleMouseUp = (event) => {
    this.handleTrackingChange(event);
    this.endTracking();
  }

  beginTracking = () => {
    this.tracking = true;
    disabledTouchmove();
    document.body.classList.add('no-select');
    document.body.addEventListener('mousemove', this.handleMouseMove, false);
    document.body.addEventListener('mouseup', this.handleMouseUp, false);
    document.body.addEventListener('touchmove', this.handleMouseMove, false);
    document.body.addEventListener('touchend', this.handleMouseUp, { passive: false });
  }

  endTracking = () => {
    this.tracking = false;
    document.body.classList.remove('no-select');
    document.body.removeEventListener('mousemove', this.handleMouseMove, false);
    document.body.removeEventListener('mouseup', this.handleMouseUp, false);
    document.body.removeEventListener('touchmove', this.handleMouseMove, false);
    document.body.removeEventListener('touchend', this.handleMouseUp, false);
  }

  handleTextChange = (value) => {
    var deg = value % 360;

    if (deg < 0) {
      deg += 360;
    }

    this.props.onChange(deg, this.props.name);
  }

  render() {
    this.checkActive(this.props);

    const style = {
      transform: `rotate(${this.props.angle}deg)`
    };

    var className = 'field-wrapper angle-picker-wrapper';

    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    if (this.props.disabled) {
      className += ' disabled';
    }

    var inputClassName = 'input';

    // Disable input if not active
    if (!this.isActive) {
      inputClassName += ' disabled';
    }

    return (
      <div className={className}>
        <div className="table-wrapper">
          { this.props.optional ? 
            <div className="active-toggle">
              <Toggle
                onChange={this.handleActiveToggle}
                checked={this.isActive}
                name="active"
              />
            </div>
          : null }
          <div className={inputClassName}>
            <label className="title">{this.props.label}</label>
            <div 
              className="angle-picker"
              ref={element => {this.element = element}}
              onMouseDown={this.handleMouseDown}
              onTouchStart={this.handleMouseDown}
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
        </div>
      </div>
    );
  }
}

export default AnglePicker;