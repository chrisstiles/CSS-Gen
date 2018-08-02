import React from 'react';

class AnglePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  handleChange() {

  }

  render() {
    const style = {
      transform: `rotate(${this.props.angle}deg)`
    };

    return (
      <div className="field-wrapper angle-picker-wrapper">
        <label className="title">{this.props.label}</label>
        <div className="angle-picker">
          <div 
            className="angle" 
            style={style}
          />
        </div>
      </div>
    );
  }
}

export default AnglePicker;