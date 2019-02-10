import React from 'react';

const Sidebar = ({ children }) => {
  return (
    <div id="sidebar">
    <div className="sidebar-title">Controls</div>
    	<div id="sidebar-controls">
      	{children}
      </div>
      
    </div>
  );
}

export default Sidebar;