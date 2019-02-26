import React from 'react';
import ReactDOM from 'react-dom';
import { extend } from 'underscore';
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
    document.addEventListener('click', this.handleDocumentClick);
  }

  componentWillUnmount() {
    currentTooltip = null;
    document.removeEventListener('click', this.handleDocumentClick);
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
      event.stopPropagation();
      const { top, left } = event.target.getBoundingClientRect();
      this.position = { top, left };
      this.open();
    }
  }

  open = () => {
    if (currentTooltip) currentTooltip.close();
    currentTooltip = this;
    
    this.setState({ isOpen: true });
  }

  close = () => {
    this.setState({ isOpen: false });
  }

  renderTooltip = () => {
    const style = extend({}, this.position);
    if (this.state.isOpen) style.display = 'block';

    const tooltip = (
      <div 
        className="tooltip" 
        style={style}
        ref={tooltip => { this.tooltip = tooltip }}
      >
        Hello
      </div>
    );
    
    return ReactDOM.createPortal(tooltip, document.querySelector('#app'));
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