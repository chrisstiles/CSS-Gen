import React from 'react';

const Sidebar = props => {
  return (
    <div id="sidebar">
      {props.children}
    </div>
  );
}

export default Sidebar;