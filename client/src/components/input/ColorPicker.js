import React from 'react';
import ChromePicker from 'react-color';
import tinycolor from 'tinycolor2';
import { hexOrRgba } from '../../util/helpers';

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
      }
    };

    this.setPosition = this.setPosition.bind(this);
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

  setPosition(el, includeLeftOffset) {
    this.previewWidth = el.offsetWidth;

    const previewRect = el.getBoundingClientRect();
    const topOffset = previewRect.top + window.scrollY + previewRect.height;

    this.previewTop = topOffset;
    this.previewLeft = includeLeftOffset ? previewRect.left : 'auto';

    const leftOffset = includeLeftOffset ? this.previewLeft : 0;

    if ((previewRect.left + leftOffset + 226) > window.innerWidth) {
      this.shiftLeft = true;
    } else {
      this.shiftLeft = false;
    }
  }

  handleClick(e) {
    this.setPosition(e.target);

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
      color = tinycolor(color.rgb);

      var returnColor;
      if (this.props.returnColorObject) {
        returnColor = color;
      } else {
        returnColor = hexOrRgba(color);
      }

      this.props.onChange(returnColor, this.props.name);
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

  renderPreview(previewStyle) {
    const renderPreview = this.props.renderPreview === undefined || this.props.renderPreview === true;
    if (renderPreview) {
      return (
        <div 
          className="color-preview" 
          style={previewStyle}
          onClick={this.handleClick}
        />
      );
    } else {
      if (this.preview) {
        this.setPosition(this.preview, true);
      }
    }
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

    const color = tinycolor(this.props.color);

    if (this.props.disableAlpha) {
      color.setAlpha(1);
    }

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

    if (this.previewLeft) {
      wrapperStyle.left = this.previewLeft;
    }

    const previewStyle = {
      backgroundColor: hexOrRgba(color)
    };

    // If color is dark enough, change grey border
    const colorTest = tinycolor(color.clone());
    
    if (colorTest) {
      const luminance = colorTest.getLuminance();
      const brightness = colorTest.getBrightness();

      if (luminance < .58 && brightness < 200) {
        previewStyle.borderColor = colorTest.setAlpha(.3).toRgbString();
      }
    }

    var className = "color-wrapper";
    if (this.props.className) {
      className += ` ${this.props.className}`;
    }

    return (
      <div className={className}>
        {this.renderPreview(previewStyle)}
        { this.state.displayColorPicker ? <div>
          <div style={cover} onClick={this.handleClose} />
          <div 
            className="color-picker-wrapper"
            style={wrapperStyle}
          >
            <ChromePicker 
              color={color.toRgbString()}
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


