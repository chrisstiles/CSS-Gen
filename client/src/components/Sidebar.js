import React from 'react';
import CodeOutput from './CodeOutput';

const Sidebar = ({ property, children, generateCSS, outputPreviewStyles, previewStyles }) => {
  return (
    <div id="sidebar">
    	<div id="sidebar-controls">
    		<div className="sidebar-title">Controls</div>
      	{children}
      </div>
      <CodeOutput
        property={property}
        generateCSS={generateCSS}
      />
    </div>
  );
}

export default Sidebar;