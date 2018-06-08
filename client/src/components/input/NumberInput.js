import React from 'react';

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.props.onChange(event);
  }

  handleBlur(event) {
    this.props.onBlur(event);
  }

  handleKeyDown(event) {
    const keyCode = event.keyCode;
    const shiftHeld = event.shiftKey;

    if (keyCode === 38) {
      // Up arrow is pressed
      this.props.handleTick(true, this.props.name, shiftHeld);
    } else if (keyCode === 40) {
      // Down arrow is pressed
      this.props.handleTick(false, this.props.name, shiftHeld);
    }
  }

  handleClick(event) {
    const el = event.target;
    el.select();
  }

  render() {
    return (
      <input
        type="text"
        name={this.props.name}
        className={`number-input ${this.props.className}`}
        defaultValue={this.props.defaultValue}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        ref={this.props.inputRef}
        step={this.props.step}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
        autoComplete="off"
      />
    );
  }
}

export default NumberInput;