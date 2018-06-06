import React from 'react';
import CodeOutput from './CodeOutput';

const Sidebar = ({ property, children, outputCSS, previewCSS }) => {
  return (
    <div id="sidebar">
    	<div id="sidebar-controls">
    		<div className="sidebar-title">Controls</div>
      	{children}
      </div>
      <CodeOutput
        property={property}
        outputCSS={outputCSS}
        previewCSS={previewCSS}
      />
    </div>
  );
}

export default Sidebar;