import React from 'react';

class Sidebar extends React.Component {
  componentDidMount() {
    this.controls.addEventListener('scroll', this.handleSidebarScroll);
  }

  componentWillUnmount() {
    this.controls.removeEventListener('scroll', this.handleSidebarScroll);
  }

  render() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default Sidebar;