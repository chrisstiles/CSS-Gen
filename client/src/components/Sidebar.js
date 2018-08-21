import React from 'react';
import CodeOutput from './CodeOutput';

const Sidebar = ({ property, children, outputCSS, outputPreviewStyles, previewCSS, hasBrowserPrefixes, showBrowserPrefixes }) => {
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
        hasBrowserPrefixes={hasBrowserPrefixes}
        showBrowserPrefixes={showBrowserPrefixes}
      />
    </div>
  );
}

export default Sidebar;