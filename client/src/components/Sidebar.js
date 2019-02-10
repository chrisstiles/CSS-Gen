import React from 'react';
import _ from 'underscore';

class Sidebar extends React.Component {
  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps.generatorState, this.props.generatorState);
  }

  render() {
    return (
      <div id="sidebar">
        <div className="sidebar-title">Controls</div>
        <div id="sidebar-controls">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Sidebar;