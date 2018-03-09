import React from 'react';
import CodeOutput from './CodeOutput';

const Sidebar = ({ property, children, generateCSS }) => {
  return (
    <div id="sidebar">
      {children}
      <CodeOutput
        property={property}
        generateCSS={generateCSS}
      />
    </div>
  );
}

export default Sidebar;