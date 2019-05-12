import React from 'react';
import ReactDOM from 'react-dom';
import ChromePicker from 'react-color/lib/Chrome';
import tinycolor from 'tinycolor2';
import { hexOrRgba, isSameOrChild, getBorderColor, disabledTouchmove } from '../../util/helpers';
import { extend } from 'underscore';

// Only one picker should be open at a time
let currentPicker = null;

class ColorPicker extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { displayColorPicker: false, position: {} };
    this.state.transparent = this.props.color === 'transparent';
  }

  componentDidMount() {
    document.addEventListener('keydown', this.keyEvent);
    document.addEventListener('mousedown', this.handleClick, false);
  }

  componentWillUnmount(){
    currentPicker = null;
    document.removeEventListener('keydown', this.keyEvent);
    document.removeEventListener('mousedown', this.handleClick);
  }

  componentDidUpdate() {
    const color = this.props.color;
    const transparent = color && ((typeof color === 'string' && color.toLowerCase() === 'transparent') || color._originalInput === 'transparent');
    this.setState({ transparent });
  }

  handleClick = e => {
    if (currentPicker === this && this.preview && this.picker) {
      if (
        !isSameOrChild(e.target, this.preview) 
        && !isSameOrChild(e.target, this.picker) 
        && !this.changingColor
      ) {
        this.close();
      }
    }
  }

  calculatePosition(el) {
    const offset = 8;
    const pickerWidth = 226;
    const pickerHeight = 245;

    const rect = el.getBoundingClientRect();
    const preview = {
      width: rect.width,
      top: rect.top + window.scrollY,
      bottom: rect.top + rect.height + window.scrollY,
      left: rect.left
    };

    let left = preview.left + (preview.width / 2) - (pickerWidth / 2);
    if (left + pickerWidth > window.innerWidth - offset) {
      left = window.innerWidth - pickerWidth - offset;
    }

    let top;
    if (preview.bottom + pickerHeight + offset > window.innerHeight - offset) {
      top = preview.top - pickerHeight - offset;
    } else {
      top = preview.bottom + offset;
    }

    return { top, left };
  }

  open = e => {
    if (currentPicker) currentPicker.close();
    currentPicker = this;

    this.setState({ 
      displayColorPicker: !this.state.displayColorPicker,
      position: this.calculatePosition(e.target)
    });
  };

  close = () => {
    currentPicker = null;
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
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

  handleChangeComplete = () => {
    this.changingColor = false;
  }

  setTransparent = () => {
    this.setState({ transparent: true });

    if (this.props.onChange) {
      this.props.onChange('transparent', this.props.name);
    }
  }

  generateColorCSS = (color = this.state.color) => {
    if (this.state.transparent) {
      return 'transparent';
    }

    const { r, g, b, a } = color;
    const colorString = `rgba(${r}, ${g}, ${b}, ${a})`;

    return colorString;
  }

  keyEvent = (event) => {
    if (!this.picker) return;
    
    if (!this.changingColor && (event.keyCode === 27 || event.keyCode === 13)) {
      this.close();
    }
  }
  
  renderPreview = (previewStyle) => {
    const renderPreview = this.props.renderPreview === undefined || this.props.renderPreview === true;
    if (renderPreview) {
      return (
        <div 
          className="color-preview" 
          style={previewStyle}
          ref={preview => { this.preview = preview }}
          onClick={this.open}
        />
      );
    } else {
      if (this.preview) {
        this.setPosition(this.preview, true);
      }
    }
  }

  renderPicker = color => {
    const { checkerButton, disableAlpha } = this.props;
    const style = extend({}, this.state.position);
    if (!this.state.displayColorPicker) style.display = 'none';
    
    const className = ['color-picker'];
    if (checkerButton) className.push('has-checker-button');
    if (this.state.transparent) className.push('transparent-active');

    const picker = (
      <div
        className={className.join(' ')}
        ref={picker => { this.picker = picker }}
        style={style}
        onTouchStart={disabledTouchmove}
      >
        <ChromePicker
          color={color.toRgbString()}
          onChange={this.handleChange}
          onChangeComplete={this.handleChangeComplete}
          disableAlpha={disableAlpha}
          style={{ opacity: .4 }}
        />
        {checkerButton ? 
          <div
            className="checker-button"
            onClick={this.setTransparent}
          />
        : null}
      </div>
    );

    return ReactDOM.createPortal(picker, document.querySelector('#app'));
  }

  render() {
    const { 
      color: _color, 
      className, 
      inline,
      checkerButton,
      disableAlpha,
    } = this.props;

    const color = tinycolor(_color);

    if (disableAlpha) {
      color.setAlpha(1);
    }

    const previewStyle = {
      backgroundColor: hexOrRgba(color)
    };

    // If color is dark enough, change grey border
    const borderColor = getBorderColor(color);
    if (borderColor) previewStyle.borderColor = borderColor;

    const wrapperClassName = ['field-wrapper', 'color-wrapper'];

    if (className) wrapperClassName.push(className);
    if (inline) wrapperClassName.push('inline');
    if (checkerButton) wrapperClassName.push('has-checker-button');
    if (this.state.transparent) wrapperClassName.push('transparent-active');
    
    return (
      <div className={wrapperClassName.join(' ')}>
        {this.props.label ? 
          <label className="title">{this.props.label}</label>
        : null}
        {this.renderPreview(previewStyle)}
        {this.renderPicker(color)}
      </div>
    )
  }
}

export default ColorPicker;


