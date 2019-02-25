import React from 'react';
import ReactDOM from 'react-dom';
import { extend } from 'underscore';

class Tooltip extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = { isOpen: false };
    this.position = {};
  }

  handleClick = event => {
    if (this.state.isOpen) {
      this.close();
    } else {
      const { top, left } = event.target.getBoundingClientRect();
      this.position = { top, left };
      this.open();
    }
  }

  open = event => {
    this.setState({ isOpen: true });
  }

  close = () => {
    this.setState({ isOpen: false });
  }

  renderTooltip = () => {
    const style = extend({}, this.position);
    if (this.state.isOpen) style.display = 'block';

    const tooltip = (
      <div className="tooltip" style={style}>Hello</div>
    );
    
    return ReactDOM.createPortal(tooltip, document.querySelector('#app'));
  }

  render() {
    return (
      <div 
        className="tooltip-icon" 
        ref={icon => { this.icon = icon }}
        onClick={this.handleClick}
      >
        {this.renderTooltip()}
      </div>
    );
  }
}

export default Tooltip;