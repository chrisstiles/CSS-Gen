import React from 'react';

class SliderTextInput extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChange(event) {
    this.props.handleTextChange(event);
  }

  handleBlur(event) {
    this.props.handleTextBlur();
  }

  handleKeyDown(event) {
    const keyCode = event.keyCode;

    if (keyCode === 38) {
      // Up arrow is pressed
      this.props.handleTick(true);
    } else if (keyCode === 40) {
      // Down arrow is pressed
      this.props.handleTick(false);
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
        className="slider-input"
        defaultValue={this.props.defaultValue}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        ref={this.props.inputRef}
        step={this.props.step}
        onKeyDown={this.handleKeyDown}
        onClick={this.handleClick}
      />
    );
  }
}

export default SliderTextInput;