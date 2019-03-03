import React from 'react';

class Sidebar extends React.Component {
  componentDidMount() {
    this.controls.addEventListener('scroll', this.handleSidebarScroll);
  }

  componentWillUnmount() {
    this.controls.removeEventListener('scroll', this.handleSidebarScroll);
  }

  handleSidebarScroll = () => {
    let { scrollTop } = this.controls;

    const activeTooltip = this.tooltips.querySelector('.open');
    
    if (activeTooltip) {
      const offset = 15;
      const top = parseInt(activeTooltip.style.top, 10) || 0;

      if (top - scrollTop <= offset) {
        activeTooltip.classList.add('fixed');
      } else {
        activeTooltip.classList.remove('fixed');
      }
    }

    this.tooltips.style.marginTop = `-${scrollTop}px`;
  }

  render() {
    return (
      <div>
        <div id="sidebar">
          <div className="sidebar-title">Controls</div>
          <div 
            id="sidebar-controls"
            ref={controls => { this.controls = controls }}
          >
            {this.props.children}
          </div>
        </div>
        <div 
          id="tooltip-wrapper" 
          ref={tooltips => { this.tooltips = tooltips }}
        />
      </div>
    );
  }
}

export default Sidebar;