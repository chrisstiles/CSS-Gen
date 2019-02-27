import React from 'react';
import ReactDOM from 'react-dom';
import { sameOrChild } from '../util/helpers';

// Only one picker should be open at a time
let currentTooltip = null;

class Tooltip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.position = {};
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('mousedown', this.handleDocumentClick);
  }

  componentWillUnmount() {
    currentTooltip = null;
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('mousedown', this.handleDocumentClick);
  }

  handleKeyDown = event => {
    if (this.state.isOpen && (event.keyCode === 27 || event.keyCode === 13)) {
      this.close();
    }
  }

  handleDocumentClick = event => {
    if (
      this.state.isOpen && 
      !sameOrChild(event.target, this.tooltip) &&
      event.target !== this.icon
    ) {
      this.close();
    }
  }

  handleIconClick = event => {
    if (this.state.isOpen && event.target === this.icon) {
      this.close();
    } else {
      this.setPosition();
      this.open();
    }
  }

  handleCloseClick = event => {
    event.preventDefault();
    event.stopPropagation();
    this.close();
  }

  setPosition = () => {
    const { top } = this.icon.getBoundingClientRect();
    this.position = { top };
  }

  open = () => {
    if (currentTooltip) currentTooltip.close();
    currentTooltip = this;
    this.setState({ isOpen: true });
  }

  close = () => {
    currentTooltip = null;
    this.setState({ isOpen: false });
  }

  renderTooltip = () => {
    const className = ['tooltip'];
    if (this.state.isOpen) className.push('open');

    const tooltip = (
      <div 
        className={className.join(' ')}
        style={this.position}
        ref={tooltip => { this.tooltip = tooltip }}
      >
        <div 
          className="close"
          ref={closeIcon => { this.closeIcon = closeIcon }}
          onClick={this.handleCloseClick}
        />
        Hello
      </div>
    );

    const wrapper = document.querySelector('#tooltip-wrapper');

    if (wrapper) {
      return ReactDOM.createPortal(tooltip, wrapper);
    }
  }

  render() {
    return (
      <div 
        className="tooltip-icon" 
        ref={icon => { this.icon = icon }}
        onClick={this.handleIconClick}
      >
        {this.renderTooltip()}
      </div>
    );
  }
}

export default Tooltip;