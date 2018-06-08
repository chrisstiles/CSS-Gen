import React from 'react';
import { numberInConstraints } from '../../util/helpers';

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.getValue = this.getValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setRefs = this.setRefs.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if ((!this.hasFocus || this.didTick) && newProps.value !== undefined) {
      this.didTick = false;
      this.element.value = newProps.value;
    }
  }

  getValue() {
    const value = this.element.value;

    if (!isNaN(value)) {
      return numberInConstraints(value, this.props.min, this.props.max);
    } else {
      return this.props.value;
    }
  }

  handleChange(event) {
    // var value = event.target.value;

    // if (!isNaN(value)) {
    //   value = numberInConstraints(value, this.props.min, this.props.max);
    //   this.props.onChange(value, event);
    // }

    this.props.onChange(this.getValue(), event);
  }

  handleFocus() {
    this.hasFocus = true;
  }

  handleBlur(value, event) {
    this.element.value = this.getValue();

    if (this.props.onBlur) {
      this.props.onBlur(event);
    }

    this.hasFocus = false;
  }

  handleKeyDown(event) {
    const keyCode = event.keyCode;
    const shiftHeld = event.shiftKey;

    if (keyCode === 38) {
      // Up arrow is pressed
      this.props.handleTick(true, this.props.name, shiftHeld);
      this.didTick = true;
    } else if (keyCode === 40) {
      // Down arrow is pressed
      this.props.handleTick(false, this.props.name, shiftHeld);
      this.didTick = true;
    }
  }

  handleClick(event) {
    const el = event.target;
    el.select();
  }

  setRefs(el) {
    this.element = el;

    if (this.props.inputRef) {
      this.props.inputRef(el);
    }
  }

  render() {
    const className = this.props.className ? ` ${this.props.className}` : '';

    return (
      <input
        type="text"
        name={this.props.name}
        className={`number-input${className}`}
        defaultValue={this.props.value}
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