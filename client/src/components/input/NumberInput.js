import React from 'react';

class NumberInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.setRefs = this.setRefs.bind(this);

    this.state = {
      value: this.props.value
    }
  }

  componentWillReceiveProps(newProps) {
    // console.log(newProps)
    // console.log(document.activeElement, this.inputRef)
    if (!this.hasFocus && newProps.value !== undefined) {
      // console.log(this.element)
      this.setState(newProps)
      console.log(this.element)
      // this.element.value = newProps.value;
    }
  }

  handleChange(event) {
    const value = event.target.value;

    if (!isNaN(value)) {
      this.props.onChange(event);
    }
  }

  handleFocus() {
    console.log('here')
    this.hasFocus = true;
  }

  handleBlur(event) {
    console.log('there')
    this.props.onBlur(event);
    this.hasFocus = false;
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

  setRefs(el) {
    this.element = el;
    this.props.inputRef(el);
  }

  render() {
    const className = this.props.className ? ` ${this.props.className}` : '';

    return (
      <input
        type="text"
        name={this.props.name}
        className={`number-input${className}`}
        defaultValue={this.props.value}
        // value={this.props.value}
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