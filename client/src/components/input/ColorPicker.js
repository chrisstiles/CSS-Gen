import React from 'react';
import ChromePicker from 'react-color';
import tinycolor from 'tinycolor2';

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
    this.keyEvent = this.keyEvent.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyEvent, false);
  }

  componentWillUnmount(){
    document.removeEventListener('keydown', this.keyEvent, false);
  }

  handleClick(e) {
    this.previewWidth = e.target.offsetWidth;

    if (this.props.onOpen) {
      this.props.onOpen(this);
    }

    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose() {
    this.setState({ displayColorPicker: false });
  };

  handleChange(color) {
    this.setState({ color: color.rgb });
    this.props.onChange(this.generateColorCSS(), color);
  };

  generateColorCSS() {
    const { r, g, b, a } = this.state.color;
    const color = `rgba(${r}, ${g}, ${b}, ${a})`;

    return color;
  }

  keyEvent(event) {
    if (event.keyCode === 27 || event.keyCode === 13) {
      this.handleClose();
    }
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
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
      zIndex: '9998'
    };

    const color = typeof this.props.backgroundColor === 'object' ? this.props.backgroundColor.hex : this.props.backgroundColor;
    const margin = this.previewWidth ? this.previewWidth / 2 : 0

    const previewStyle = {
      backgroundColor: color
    };

    // If color is dark enough, change grey border
    const colorTest = tinycolor(color);
    
    if (colorTest) {
      const luminance = colorTest.getLuminance();
      const brightness = colorTest.getBrightness();

      if (luminance < .58 && brightness < 200) {
        previewStyle.borderColor = color;
      }
    }

    return (
      <div className="color-picker-wrapper">
        <div 
          className="color-preview" 
          style={previewStyle}
          onClick={this.handleClick}
        >
        <div />
        </div>
        { this.state.displayColorPicker ? <div>
          <div style={cover} onClick={this.handleClose} />
          <div style={{ marginLeft: margin }}>
            <ChromePicker 
              color={color}
              onChange={this.handleChange}
              disableAlpha={this.props.disableAlpha}
            />
          </div>
        </div> : null }

      </div>
    )
  }
}

export default ColorPicker;


