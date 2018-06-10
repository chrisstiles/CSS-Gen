import React from 'react';
import CodeOutput from './CodeOutput';

const Sidebar = ({ property, children, outputCSS, outputPreviewStyles, previewCSS, browserPrefixes }) => {
  return (
    <div id="sidebar">
    	<div id="sidebar-controls">
    		<div className="sidebar-title">Controls</div>
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