import React from 'react';
import ChromePicker from 'react-color';

class ColorPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      color: {
        r: '255',
        g: '255',
        b: '255',
        a: '1'
      },
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose() {
    this.setState({ displayColorPicker: false })
  };

  handleChange(color) {
    this.setState({ color: color.rgb });
    this.props.onChange(this.generateColorCSS());
  };

  generateColorCSS() {
    const { r, g, b, a } = this.state.color;
    const color = `rgba(${r}, ${g}, ${b}, ${a})`

    return color;
  }

  reset() {
    this.setState({
      color: {
        r: '255',
        g: '255',
        b: '255',
        a: '1'
      }
    });
  }

  render() {
    const color = this.generateColorCSS();
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    };

    return (
      <div>
        <div 
          className="color-preview" 
          style={{ backgroundColor: this.props.backgroundColor }}
          onClick={this.handleClick}
        >
        <div />
        </div>
        { this.state.displayColorPicker ? <div>
          <div style={cover} onClick={this.handleClose} />
          <ChromePicker 
            color={this.state.color} 
            onChange={this.handleChange}
          />
        </div> : null }

      </div>
    )
  }
}

export default ColorPicker;


