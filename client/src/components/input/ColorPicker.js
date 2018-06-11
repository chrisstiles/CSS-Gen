import React from 'react';
import ChromePicker from 'react-color';
import tinycolor from 'tinycolor2';

// Only one picker should be open at a time
var currentPicker = null;

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

    const previewRect = e.target.getBoundingClientRect();
    const topOffset = previewRect.top + window.scrollY + previewRect.height;

    this.previewTop = topOffset;
    // console.log(previewRect.left + 226, window.innerWidth)
    if ((previewRect.left + 226) > window.innerWidth) {
      this.shiftLeft = true;
    } else {
      this.shiftLeft = false;
    }

    if (currentPicker) {
      currentPicker.handleClose();
    }

    currentPicker = this;

    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose() {
    currentPicker = null;
    this.setState({ displayColorPicker: false });
  };

  handleChange(color) {
    this.setState({ color: color.rgb });
    if (this.props.onChange) {
      this.props.onChange(this.generateColorCSS(color.rgb), color);
    }
  };

  generateColorCSS(color = this.state.color) {
    const { r, g, b, a } = color;
    const colorString = `rgba(${r}, ${g}, ${b}, ${a})`;

    return colorString;
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

    var margin;
    if (this.shiftLeft) {
      margin = -113 + this.previewWidth;
    } else {
      margin = this.previewWidth ? this.previewWidth / 2 : 0;
    }



    const wrapperStyle = {
      marginLeft: margin
    };

    // Adjust top position in case user has scrolled
    if (this.previewTop) {
      wrapperStyle.top = this.previewTop;
    }

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

    var className = "color-wrapper";
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    return (
      <div className={className}>
        <div 
          className="color-preview" 
          style={previewStyle}
          onClick={this.handleClick}
        >
        <div />
        </div>
        { this.state.displayColorPicker ? <div>
          <div style={cover} onClick={this.handleClose} />
          <div 
            className="color-picker-wrapper"
            style={wrapperStyle}
          >
            <ChromePicker 
              color={color}
              onChange={this.handleChange}
              disableAlpha={this.props.disableAlpha}
              style={{ opacity: .4 }}
            />
          </div>
        </div> : null }

      </div>
    )
  }
}

export default ColorPicker;


