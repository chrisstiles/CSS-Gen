import React from 'react';
import CodeOutput from './CodeOutput';

const Sidebar = ({ property, children, outputCSS, outputPreviewStyles, previewCSS, browserPrefixes }) => {
  return (
    <div id="sidebar">
    <div className="sidebar-title">Controls</div>
    	<div id="sidebar-controls">
      	{children}
      </div>
      <CodeOutput
        property={property}
        outputCSS={outputCSS}
        outputPreviewStyles={outputPreviewStyles}
        previewCSS={previewCSS}
        browserPrefixes={browserPrefixes}
      />
    </div>
  );
}

export default Sidebar;