import React from 'react';
import Page from './Page';
import Sidebar from './Sidebar';

const Generator = (props) => {
  const { title, property, generateCSS, renderInputs, heading, children, toolbar, previewWindow, previewStyles } = props;
  return (
    <Page
      title={title}
      heading={heading}
      toolbar={toolbar}
    >
      <div id="generator-wrapper">
        <div id="generator" className="page-content">
          {previewWindow}
          <Sidebar
            property={property}
            generateCSS={generateCSS}
          >
            {renderInputs()}
          </Sidebar>
          {children}
        </div>
      </div>
    </Page>
  );
}

export default Generator;