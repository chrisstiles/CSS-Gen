import React from 'react';
import RCSlider, { Handle as RCHandle } from 'rc-slider';
import NumberInput from './NumberInput';

const Handle = props => {
  const { value, dragging, index, ...restProps } = props;

  return (
    <RCHandle 
      {...restProps}
      className={'rc-slider-handle' + (props.dragging ? ' dragging' : '')}
      value={value} 
    />
  );
};

class Slider extends RCSlider {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    this.props.onChange(value, this.props.name);
  }

  render() {
    const min = this.props.min || 0;
    const max = this.props.max || 200;

    var className = 'field-wrapper';
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    return (
      <div className={className}>
        <label className="title">
          <NumberInput
            className="slider-input"
            value={this.props.value}
            onChange={this.handleChange}
            step={this.props.step || 1}
            min={min}
            max={max}
          />
          {this.props.title}
        </label>
        <RCSlider
          min={min}
          max={max}
          value={this.props.value || 0}
          handle={Handle}
          step={this.props.step || 1}
          onChange={this.handleChange}
          tabIndex={-1}
        />
      </div>
    );
  }
}

export default Slider;

