import React from 'react';
import { numberInConstraints, createSelection } from '../../util/helpers';

class NumberInput extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getValue = this.getValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleTick = this.handleTick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.formatValue = this.formatValue.bind(this);
    this.setRefs = this.setRefs.bind(this);
  }

  componentDidUpdate() {
    if ((!this.hasFocus || this.didTick || this.props.forceUpdate) && this.props.value !== undefined) {
      this.didTick = false;

      let value = this.props.value;

      if (this.props.appendString) {
        value += this.props.appendString;
      }

      this.element.value = value;
    }
  }

  getValue() {
    var value = this.element.value;

    if (this.props.appendString) {
      value = value.replace(this.props.appendString, '');
    }

    if (!isNaN(value)) {
      return Number(numberInConstraints(value, this.props.min, this.props.max));
    } else {
      return Number(this.props.value);
    }
  }

  formatValue(value) {
    if (this.props.appendString) {
      String(value).replace(this.props.appendString, '');
      value += this.props.appendString;
    }

    return value;
  }

  handleChange(event) {
    this.props.onChange(this.getValue(), this.props.name, event);
  }

  handleFocus() {
    this.hasFocus = true;
  }

  handleBlur(value, event) {
    this.element.value = this.formatValue(this.getValue());

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    this.hasFocus = false;
  }

  handleTick(up, event, shiftHeld) {
    var step = this.props.step || 1;

    if (shiftHeld) {
      if (step === 1) {
        step = 10;
      } else if (step === .01) {
        step = .1;
      }
    }

    var newValue = up ? this.props.value + step : this.props.value - step;

    const decimals = (String(newValue).split('.')[1] || []).length;

    if (decimals > 2) {
      newValue = Number(newValue.toFixed(2));
    }
    
    newValue = numberInConstraints(newValue, this.props.min, this.props.max);

    this.props.onChange(newValue, this.props.name, event);

    if (this.props.onTick) {
      this.props.onTick(up, event, shiftHeld);
    }
  }

  handleKeyDown(event) {
    const keyCode = event.keyCode;
    const shiftHeld = event.shiftKey;

    if (keyCode === 38) {
      // Up arrow is pressed
      this.handleTick(true, event, shiftHeld);
      this.didTick = true;
    } else if (keyCode === 40) {
      // Down arrow is pressed
      this.handleTick(false, event, shiftHeld);
      this.didTick = true;
    }
  }

  handleClick(event) {
    const el = event.target;

    if (this.props.appendString) {
      const end = el.value.length - this.props.appendString.length;
      createSelection(el, 0, end);
    } else {
      el.select();
    }
  }

  setRefs(el) {
    this.element = el;

    if (this.props.inputRef) {
      this.props.inputRef(el);
    }
  }

  render() {
    const value = this.formatValue(this.props.value);

    var className = this.props.className ? ` ${this.props.className}` : '';

    className += ' number-input';

    if (this.props.appendString) {
      className += ' has-string';
    }

    return (
      <input
        type="text"
        name={this.props.name}
        className={className.trim()}
        defaultValue={value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        ref={this.setRefs}
        step={this.props.step}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
        autoComplete="off"
      />
    );
  }
}

export default NumberInput;