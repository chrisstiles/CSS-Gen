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

    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleTextBlur = this.handleTextBlur.bind(this);
    this.tick = this.tick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // this.textInput.value = nextProps.value;
  }

  handleSliderChange(value) {
    this.props.handleChange(this.props.name, value);
    // this.textInput.value = value;
  }

  handleTextChange(event, shouldSetDecimal) {
    var value = Number(event.target.value);

    if (!isNaN(value)) {
      if (value < this.props.min) {
        this.props.handleChange(this.props.name, this.props.min);
      } else if (value > this.props.max) {
        this.props.handleChange(this.props.name, this.props.max);
      } else {
        this.props.handleChange(this.props.name, value);
      }
    }

  }

  handleTextBlur() {
    // this.textInput.value = this.props.value;
  }

  tick(up = true, type, shiftHeld) {
    var step = this.props.step || 1;

    if (shiftHeld) {
      if (step === 1) {
        step = 10;
      } else if (step === .01) {
        step = .1;
      }
    }

    var newValue = up ? this.props.value + step : this.props.value - step;

    // Get number of decimal places in newValue
    const decimals = (String(newValue).split('.')[1] || []).length;

    if (decimals > 2) {
      newValue = Number(newValue.toFixed(2));
    }

    // Adjust new value for max or minimum
    if (newValue < this.props.min) {
      newValue = this.props.min;
    } else if (newValue > this.props.max) {
      newValue = this.props.max;
    }

    // Update slider and text input
    this.props.handleChange(this.props.name, newValue);
    // this.textInput.value = newValue;
  }

  render() {
    const min = this.props.min || 0;
    const max = this.props.max || 200;

    return (
      <div className="field-wrapper">
        <label className="title">
          <NumberInput
            className="slider-input"
            value={this.props.value}
            onChange={this.handleTextChange}
            onBlur={this.handleTextBlur}
            // inputRef={el => this.textInput = el}
            step={this.props.step || 1}
            handleTick={this.tick}
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
          onChange={this.handleSliderChange}
          onAfterChange={this.handleSliderChange}
          tabIndex={-1}
        />
      </div>
    );
  }
}

export default Slider;

