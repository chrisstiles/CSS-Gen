import React from 'react';
import Slider from './Slider';

class Position extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (!this.props.active) {
      this.props.onClick(this.props.position, this.props.name);
    }
  }

  render() {
    var className = `position ${this.props.position.replace(' ', '-')}`;

    if (this.props.active) {
      className += ' active';
    }

    return (
      <div 
        className={className}
        onClick={this.handleClick}
      />
    );
  }
}

const locations = ['center', 'top left', 'top', 'top right', 'right', 'bottom right', 'bottom', 'bottom left', 'left'];

class PositionSelect extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, name) {
    this.props.onClick(value, name);
  }

  render() {
    const { position, offsetX, offsetY, label, includeCenter, name } = this.props;
    const positions = locations.map(location => {
    const active = position === location;

    if (includeCenter !== undefined && !includeCenter && location === 'center') {
      return null;
    }

    return (
      <Position 
        key={location}
        position={location} 
        active={active}
        onClick={this.handleChange}
        name={name || 'position'}
      />
    );
    });

    const xDisabled = ['center', 'top', 'bottom'].indexOf(position) !== -1;
    const yDisabled = ['center', 'left', 'right'].indexOf(position) !== -1;

    return (
      <div className="field-wrapper position-select-wrapper">
        {label ? 
          <label className="title">{label}</label>
        : null}
        <div className="row">
          <div className="position-select">
            {positions}
          </div>
          {offsetX !== undefined && offsetY !== undefined ?
            <div className="offset-sliders">
              <Slider
                title="X Offset"
                name="offsetX"
                onChange={this.handleChange}
                value={offsetX}
                disabled={xDisabled}
                min={-200}
                max={200}
                appendString="%"
              />
              <Slider
                title="Y Offset"
                name="offsetY"
                onChange={this.handleChange}
                value={offsetY}
                disabled={yDisabled}
                min={-200}
                max={200}
                appendString="%"
              />
            </div>
          : null}
        </div>
      </div>
    );
  }
}

export default PositionSelect;