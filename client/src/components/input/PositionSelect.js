import React from 'react';
import Slider from './Slider';

class Position extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (!this.props.active) {
      this.props.onClick(this.props.position, 'position');
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
    const { position } = this.props;
    const positions = locations.map(location => {
      const active = position === location;

      return (
        <Position 
          key={location}
          position={location} 
          active={active}
          onClick={this.handleChange}
        />
      );
    });

    const xDisabled = ['center', 'top', 'bottom'].indexOf(position) !== -1;
    const yDisabled = ['center', 'left', 'right'].indexOf(position) !== -1;

    return (
      <div className="field-wrapper position-select-wrapper">
        <label className="title">{this.props.label}</label>
        <div className="row">
          <div className="position-select">
            {positions}
          </div>
          <div className="offset-sliders">
            <Slider
              title="X Offset"
              name="positionX"
              onChange={this.handleChange}
              value={this.props.positionX}
              disabled={xDisabled}
              min={-500}
              max={500}
            />
            <Slider
              title="Y Offset"
              name="positionY"
              onChange={this.handleChange}
              value={this.props.positionY}
              disabled={yDisabled}
              min={-500}
              max={500}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PositionSelect;