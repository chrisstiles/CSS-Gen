import React from 'react';

const Sidebar = props => {
  return (
    <div id="sidebar">
      <div className="sidebar-title">Controls</div>
      <div id="sidebar-controls">
        {props.children}
      </div>
    </div>
  );
}

export default Sidebar;