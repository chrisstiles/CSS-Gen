import React from 'react';
import ChromePicker from 'react-color/lib/Chrome';
import tinycolor from 'tinycolor2';
import { hexOrRgba } from '../../util/helpers';

// Only one picker should be open at a time
let currentPicker = null;

class ColorPicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { displayColorPicker: false };

    this.state.transparent = this.props.color === 'transparent';

    this.setPosition = this.setPosition.bind(this);
    this.close = this.close.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeComplete = this.handleChangeComplete.bind(this);
    this.setTransparent = this.setTransparent.bind(this);
    this.keyEvent = this.keyEvent.bind(this);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyEvent, false);
  }

  componentWillUnmount(){
    currentPicker = null;
    document.removeEventListener('keydown', this.keyEvent);
  }

  componentDidUpdate() {
    const color = this.props.color;
    const transparent = color && ((typeof color === 'string' && color.toLowerCase() === 'transparent') || color._originalInput === 'transparent');
    this.setState({ transparent });
  }

  setPosition(el, includeLeftOffset) {
    this.previewWidth = el.offsetWidth;

    const previewRect = el.getBoundingClientRect();
    let topOffset = previewRect.top + previewRect.height;

    if (!this.props.isFixed) {
      topOffset += window.scrollY;
    }

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
      currentPicker.close();
    }

    currentPicker = this;

    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  close() {
    currentPicker = null;
    this.setState({ displayColorPicker: false });
  };

  handleChange(color) {
    color = tinycolor(color.rgb);
    this.changingColor = true;

    if (this.props.onChange) {
      // Reset alpha if switching from transparent to regular color
      if (this.state.transparent) {
        color.setAlpha(1);
      }

      let returnColor;
      if (this.props.returnColorObject) {
        returnColor = color;
      } else {
        returnColor = hexOrRgba(color);
      }

      this.props.onChange(returnColor, this.props.name);
    }

    this.setState({ color, transparent: false });
  };

  handleChangeComplete() {
    this.changingColor = false;
  }

  setTransparent() {
    this.setState({ transparent: true });

    if (this.props.onChange) {
      this.props.onChange('transparent', this.props.name);
    }
  }

  generateColorCSS(color = this.state.color) {
    if (this.state.transparent) {
      return 'transparent';
    }

    const { r, g, b, a } = color;
    const colorString = `rgba(${r}, ${g}, ${b}, ${a})`;

    return colorString;
  }

  keyEvent(event) {
    if (!this.changingColor && (event.keyCode === 27 || event.keyCode === 13)) {
      this.close();
    }
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
      zIndex: '99998'
    };

    const color = tinycolor(this.props.color);

    if (this.props.disableAlpha) {
      color.setAlpha(1);
    }

    let margin;
    if (this.shiftLeft) {
      margin = -113 + this.previewWidth;
    } else {
      margin = this.previewWidth ? this.previewWidth / 2 : 0;
    }

    const wrapperStyles = {
      marginLeft: margin
    };

    // Adjust top position in case user has scrolled
    if (this.previewTop) {
      wrapperStyles.top = this.previewTop;
    }

    if (this.previewLeft) {
      wrapperStyles.left = this.previewLeft;
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

    const className = ['field-wrapper', 'color-wrapper'];

    if (this.props.className) {
      className.push(this.props.className);
    }

    if (this.props.inline) {
      className.push('inline')
    }

    if (this.state.transparent) {
      className.push('transparent-active');
    }

    const style = {};

    if (this.state.displayColorPicker) {
      style.display = 'block';
    } else {
      style.display = 'none';
    }

    return (
      <div className={className.join(' ')}>
        {this.props.label ? 
          <label className="title">{this.props.label}</label>
        : null}
        {this.renderPreview(previewStyle)}
        <div style={style}>
          <div style={cover} onClick={this.close} />
          <div 
            className="color-picker-wrapper"
            style={wrapperStyles}
          >
            <div className="content">
              <ChromePicker
                color={color.toRgbString()}
                onChange={this.handleChange}
                onChangeComplete={this.handleChangeComplete}
                disableAlpha={this.props.disableAlpha}
                style={{ opacity: .4 }}
              />
              <div
                className="transparent-button"
                onClick={this.setTransparent}
              />
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default ColorPicker;


