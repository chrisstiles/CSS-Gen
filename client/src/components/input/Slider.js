import React from 'react';
import RCSlider, { Handle as RCHandle } from 'rc-slider';

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

    this.handleSliderChange = this.handleSliderChange.bind(this);
  }

  handleSliderChange(value) {
    this.props.handleChange(this.props.name, value);
  }

  render() {
    return (
      <RCSlider
        min={this.props.min || 0}
        max={this.props.max || 200}
        defaultValue={this.props.defaultValue || 0}
        handle={Handle}
        step={this.props.step || 1}
        onChange={this.handleSliderChange}
        onAfterChange={this.handleSliderChange}
      />
    );
  }
}

export default Slider;

