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
    this.textInput.value = nextProps.value;
  }

  handleSliderChange(value) {
    this.props.handleChange(this.props.name, value);
    this.textInput.value = value;
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
    this.textInput.value = this.props.value;
  }

  tick(up = true) {
    const step = this.props.step || 1;
    var newValue = up ? this.props.value + step : this.props.value - step;

    // Get number of decimal places in newValue
    const decimals = (String(newValue).split('.')[1] || []).length;

    if (decimals > 2) {
      newValue = Number(newValue.toFixed(2));
    }

    if (newValue >= this.props.min && newValue <= this.props.max) {
      this.props.handleChange(this.props.name, newValue);
      this.textInput.value = newValue;
    }
  }

  render() {
    return (
      <div className="field-wrapper">
        <div className="title">
          <NumberInput
            className="slider-input"
            defaultValue={this.props.value}
            onChange={this.handleTextChange}
            onBlur={this.handleTextBlur}
            inputRef={el => this.textInput = el}
            step={this.props.step || 1}
            handleTick={this.tick}
          />
          {this.props.title}
        </div>
        <RCSlider
          min={this.props.min || 0}
          max={this.props.max || 200}
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

